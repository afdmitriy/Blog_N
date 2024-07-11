import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { SessionRepository } from "../infrastructure/session.repository";
import { ResultObjectModel } from "../../../base/models/result.object.type";
import { ResultStatus } from "../../../base/models/enums/enums";
import { Inject } from "@nestjs/common";

export class DevicesDeleteCommand {
   constructor(
      public deviceId: string,
      public userId: string
   ) { }
}

@CommandHandler(DevicesDeleteCommand)
export class DevicesDeleteUseCase implements ICommandHandler<DevicesDeleteCommand> {
   constructor(
      @Inject(SessionRepository.name) private readonly sessionRepository: SessionRepository
   ) {}
   async execute(command: DevicesDeleteCommand): Promise<ResultObjectModel<null>> {
      const res = await this.sessionRepository.deleteSessionsExcludeId(command.deviceId, command.userId)
      if (!res) return {
         data: null,
         status: ResultStatus.SERVER_ERROR
      }
      return {
         data: null,
         status: ResultStatus.SUCCESS
      }
   }
}