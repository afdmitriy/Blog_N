import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../base/models/result.object.type";
import { ResultStatus } from "../../../base/models/enums/enums";
import { Inject } from "@nestjs/common";
import { SessionRepository } from "../infrastructure/session.typeOrm.repository";

export class DeviceDeleteCommand {
   constructor(public userId: string,
      public deviceId: string
   ) { }
}

@CommandHandler(DeviceDeleteCommand)
export class DeviceDeleteUseCase implements ICommandHandler<DeviceDeleteCommand> {
   constructor(
      @Inject(SessionRepository.name) private readonly sessionRepository: SessionRepository
   ) {}
   async execute(command: DeviceDeleteCommand): Promise<ResultObjectModel<null>> {
      const session = await this.sessionRepository.getById(command.deviceId)
      if (!session) return {
         data: null,
         errorMessage: 'Session not found',
         status: ResultStatus.NOT_FOUND
      }
      if(session.userId !== command.userId) return {
         data: null,
         errorMessage: 'Forbidden',
         status: ResultStatus.FORBIDDEN
      }
      await this.sessionRepository.deleteById(command.deviceId)
      return {
         data: null,
         status: ResultStatus.SUCCESS
      }
   }
}