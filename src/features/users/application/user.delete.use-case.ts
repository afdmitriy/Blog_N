import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../base/models/result.object.type";
import { ResultStatus } from "../../../base/models/enums/enums";
import { Inject } from "@nestjs/common";
import { UserRepository } from "../infrastructure/user.typeOrm.repository";

export class UserDeleteCommand {
   constructor(public userId: string,
   ) { }
}

@CommandHandler(UserDeleteCommand)
export class UserDeleteUseCase implements ICommandHandler<UserDeleteCommand> {
   constructor(
      @Inject(UserRepository.name) private readonly userRepository: UserRepository
   ) {}
   async execute(command: UserDeleteCommand): Promise<ResultObjectModel<null>> {
      const user = await this.userRepository.getById(command.userId)
      if (!user) return {
         data: null,
         errorMessage: 'User not found',
         status: ResultStatus.NOT_FOUND
      }
      await this.userRepository.deleteById(command.userId)
      return {
         data: null,
         status: ResultStatus.SUCCESS
      }
   }
}