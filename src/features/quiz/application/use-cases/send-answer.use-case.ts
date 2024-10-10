import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { Game_Orm } from "../../domain/entities/game.entity";
import { GameRepository } from "../../infrastructure/pair-game-repositories/game.repository";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { GameStatusEnum } from "../../api/models/enums/enums";

export class SendAnswerCommand {
   constructor(public userId: string,
      answer: string
   ) { }
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerUseCase implements ICommandHandler<SendAnswerCommand> {
   constructor(
      @Inject(GameRepository.name) private readonly gameRepository: GameRepository,
   ) { }
   async execute(command: StartGameCommand): Promise<ResultObjectModel<string | null>> {
      try {
         const game = await this.gameRepository.getUnfinishedGameByUserId(command.userId)
         if (!game) return {
            data: null,
            errorMessage: 'Current user is not inside active pair game',
            status: ResultStatus.FORBIDDEN
         }
         
         

      } catch (error) {
         console.log(error)
         throw error
      }
   }
}