import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserService } from "../../../users/application/user.service";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { UserRepository } from "../../../users/infrastructure/user.typeOrm.repository";
import { Inject } from "@nestjs/common";
import { RecoveryPasswordDataRepository } from "../../infrastructure/recovery.password.data.repository";


export class SetNewPasswordCommand {
   constructor(public password: string,
      public recoveryCode: string
   ) { }
}

@CommandHandler(SetNewPasswordCommand)
export class SetNewPasswordUseCase implements ICommandHandler<SetNewPasswordCommand> {
   constructor(
      @Inject(UserRepository.name) private readonly userRepository: UserRepository,
      @Inject(RecoveryPasswordDataRepository.name) private readonly passwordRecoveryDataRepository: RecoveryPasswordDataRepository,
      protected userService: UserService,
   ) { }

   async execute(command: SetNewPasswordCommand): Promise<ResultObjectModel<null> | false> {
      try {
         const recoveryData = await this.passwordRecoveryDataRepository.getByRecoveryCode(command.recoveryCode)
         if (!recoveryData) return {
            data: null,
            errorMessage: 'Code not found',
            status: ResultStatus.NOT_FOUND
         }
         
         if ((recoveryData.expirationDate < new Date()) || recoveryData.isConfirmed === true) {
            return {
               data: null,
               errorMessage: 'Recovery code is expired or has already been verified',
               status: ResultStatus.FORBIDDEN
            };
         }

         const user = await this.userRepository.getById(recoveryData.userId)
         const hash = await this.userService.generateHash(command.password)
         user!.updatePassword(hash)
         await this.userRepository.save(user!)
         recoveryData.confirm()
         await this.passwordRecoveryDataRepository.save(recoveryData)
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