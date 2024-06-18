import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { UserInputModel } from '../../../users/api/models/input/user.input';
import { UserService } from '../../../users/application/user.service';
import { MailService } from '../../../../infrastructure/adapters/mailer/mail.service';
import { ResultStatus } from '../../../../base/models/enums/enums';

export class UserRegistrationCommand {
  constructor(public userData: UserInputModel) {}
}

@CommandHandler(UserRegistrationCommand)
export class UserRegistrationUseCase implements ICommandHandler<UserRegistrationCommand> {
  constructor(
    protected userService: UserService,
    protected mailService: MailService,
  ) {}

  async execute(command: UserRegistrationCommand): Promise<boolean> {
   const token = uuidv4();
      try {
         const newUser = await this.userService.createUser(command.userData);
         if (newUser.status !== ResultStatus.SUCCESS) {
            return false;
         }
         const isCreate = await this.userService.createConfirmData(
            newUser.data!.id,
            token
         );
         if (!isCreate) {
            console.log('Error: registrate user case');
            return false;
         }

         await this.mailService.sendUserConfirmation(command.userData.email, command.userData.login, token)

         return true;
      } catch (error) {
         console.log(error);
         return false;
      }

  }
}