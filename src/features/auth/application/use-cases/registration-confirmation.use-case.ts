import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UserRepository } from "../../../users/infrastructure/user.typeOrm.repository";
import { Inject } from "@nestjs/common";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../base/models/enums/enums";

export class RegistrationConfirmationCommand {
   constructor(public code: string) { }
}

@CommandHandler(RegistrationConfirmationCommand)
export class RegistrationConfirmationUseCase implements ICommandHandler<RegistrationConfirmationCommand> {
   constructor(
      @Inject(UserRepository.name) private readonly userRepository: UserRepository
   ) { }

   async execute(command: RegistrationConfirmationCommand): Promise<ResultObjectModel<null>> {
      // приходит код, проверяю, что он есть в базе, не протух и isConfirmed это false, вношу подтверждение в isConfirmed
      try {
         const user = await this.userRepository.getByConfirmationCode(command.code);
         if (!user) return {
            data: null,
            errorMessage: 'User not found',
            status: ResultStatus.NOT_FOUND
         }

         user.confirmEmail()
         await this.userRepository.save(user);
         return {
            data: null,
            status: ResultStatus.SUCCESS
         }
      } catch (error) {
         console.error('Error during email confirmation:', error);
         return {
            data: null,
            errorMessage: 'Error during email confirmation',
            status: ResultStatus.SERVER_ERROR
         }
      }
   }
}