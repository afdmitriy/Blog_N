import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { UserInputModel } from '../../../users/api/models/input/user.input';
import { UserService } from '../../../users/application/user.service';
import { MailService } from '../../../../infrastructure/adapters/mailer/mail.service';
import { ResultStatus } from '../../../../base/models/enums/enums';
import { UserCreateCommand } from '../../../users/application/user.create.use-case';
import { add } from 'date-fns';
import { UserRepository } from '../../../users/infrastructure/user.typeOrm.repository';
import { Inject } from '@nestjs/common';

export class UserRegistrationCommand {
   constructor(public userData: UserInputModel) { }
}

@CommandHandler(UserRegistrationCommand)
export class UserRegistrationUseCase implements ICommandHandler<UserRegistrationCommand> {
   constructor(
      protected userService: UserService,
      protected mailService: MailService,
      private readonly commandBus: CommandBus,
      @Inject(UserRepository.name) private readonly userRepository: UserRepository
   ) { }

   async execute(command: UserRegistrationCommand): Promise<boolean> {
      const token = uuidv4();
      const expirationDate = add(new Date(), {
         hours: 1,
      })

      try {
         const newUserId = await this.commandBus.execute(new UserCreateCommand(command.userData))
         if (newUserId.status !== ResultStatus.SUCCESS) {
            return false;
         }

         const user = await this.userRepository.getById(newUserId.data)
         if (!user) return false
         user.addConfirmData(token, expirationDate)
         await this.userRepository.save(user)
         
         await this.mailService.sendUserConfirmation(command.userData.email, command.userData.login, token)

         return true;
      } catch (error) {
         console.log(error);
         return false;
      }

   }
}