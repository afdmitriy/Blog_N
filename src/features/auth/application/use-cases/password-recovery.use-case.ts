import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { v4 as uuidv4 } from 'uuid';
import { MailService } from "../../../../infrastructure/adapters/mailer/mail.service";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { Inject } from "@nestjs/common";
import { UserRepository } from "../../../users/infrastructure/user.typeOrm.repository";
import { RecoveryPasswordDataRepository } from "../../infrastructure/recovery.password.data.repository";
import { add } from "date-fns";
import { PasswordResetData } from "../../domain/recovery.password.data.entity";


export class PasswordRecoveryCommand {
   constructor(public email: string) { }
}

@CommandHandler(PasswordRecoveryCommand)
export class PasswordRecoveryUseCase implements ICommandHandler<PasswordRecoveryCommand> {
   constructor(
      @Inject(UserRepository.name) private readonly userRepository: UserRepository,
      @Inject(RecoveryPasswordDataRepository.name) private readonly passwordRecoveryDataRepository: RecoveryPasswordDataRepository,
      private readonly mailService: MailService,

   ) { }

   async execute(command: PasswordRecoveryCommand): Promise<ResultObjectModel<null> | false> {
      try {
         const user = await this.userRepository.getByLoginOrEmail(command.email);
         if (!user) return {
            data: null,
            errorMessage: 'User not found',
            status: ResultStatus.NOT_FOUND
         }
         const token = uuidv4();
         const recoveryPasswordModel = {
            userId: user.id,
            recoveryCode: token,
            expirationDate: add(new Date(), {
               hours: 1,
            })
         }
         const recData = PasswordResetData.createData(recoveryPasswordModel)
         await this.passwordRecoveryDataRepository.save(recData)
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
