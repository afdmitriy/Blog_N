import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResultStatus } from "src/base/models/enums/enums";
import { ResultObjectModel } from "src/base/models/result.object.type";
import { UserService } from "src/features/users/application/user.service";
import { UserRepository } from "src/features/users/infrastructure/user.repository";

export class SetNewPasswordCommand {
   constructor(public password: string,
      public recoveryCode: string
   ) { }
}

@CommandHandler(SetNewPasswordCommand)
export class SetNewPasswordUseCase implements ICommandHandler<SetNewPasswordCommand> {
   constructor(
      protected userRepository: UserRepository,
      protected userService: UserService,
   ) { }

   async execute(command: SetNewPasswordCommand): Promise<ResultObjectModel<null> | false> {
      try {
         const user = await this.userRepository.getUserByRecoveryCode(command.recoveryCode)
         if (!user) return {
            data: null,
            errorMessage: 'User not found',
            status: ResultStatus.NOT_FOUND
         }
         const date = Date.parse(user.passwordResetData.expirationDate)
         if ((new Date(date) < new Date()) || user.passwordResetData.isConfirmed === true) {
            return {
               data: null,
               errorMessage: 'Recovery code is expired or ahas already been verified',
               status: ResultStatus.FORBIDDEN
            };
         }
         
         const hash = await this.userService.generateHash(command.password)
         user.updatePassword(hash)
         await this.userRepository.saveUser(user)
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