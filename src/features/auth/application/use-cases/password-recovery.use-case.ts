import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResultStatus } from "src/base/models/enums/enums";
import { ResultObjectModel } from "src/base/models/result.object.type";
import { UserRepository } from "src/features/users/infrastructure/user.repository";
import { MailService } from "src/infrastructure/adapters/mailer/mail.service";
import { v4 as uuidv4 } from 'uuid';

export class PasswordRecoveryCommand {
   constructor(public email: string) { }
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand> {
   constructor(
      protected userRepository: UserRepository,
      protected mailService: MailService,
   ) { }

   async execute(command: PasswordRecoveryCommand): Promise<ResultObjectModel<{ accessToken: string, refreshToken: string }> | false> {
      try {
         const user = await this.userRepository.getUserByLoginOrEmail(command.email);
         if (!user) return {
            data: null,
            errorMessage: 'User not found',
            status: ResultStatus.NOT_FOUND
         }
         const token = uuidv4();
         user.createPasswordRecoveryData(token)
         await this.userRepository.saveUser(user)
         await this.mailService.sendPasswordRecovery(user.email, user.login, token)
         return {
            data: null,
            status: ResultStatus.SUCCESS
         }
      } catch (error) {
         console.log(error);
         return false;
      }
   }
}