import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { Player_Orm } from "../../domain/entities/player.entity";
import { Game_Orm } from "../../domain/entities/game.entity";
import { PlayerRepository } from "../../infrastructure/player.repository";
import { GameRepository } from "../../infrastructure/pair-game-repositories/game.repository";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { GameStatusEnum } from "../../api/models/enums/enums";
import { GameQuestion_Orm } from "../../domain/entities/game-question.entity";
import { QuestionRepository } from "../../infrastructure/quiz-repositories/question.repository";
import { GameQuestionRepository } from "../../infrastructure/game-question.repository";

export class StartGameCommand {
   constructor(public userId: string
   ) { }
}

@CommandHandler(StartGameCommand)
export class StartGameUseCase implements ICommandHandler<StartGameCommand> {
   constructor(
      @Inject(GameRepository.name) private readonly gameRepository: GameRepository,
      @Inject(PlayerRepository.name) private readonly playerRepository: PlayerRepository,
      @Inject(QuestionRepository.name) private readonly questionRepository: QuestionRepository,
      @Inject(GameQuestionRepository.name) private readonly gameQuestionRepository: GameQuestionRepository,
   ) { }
   async execute(command: StartGameCommand): Promise<ResultObjectModel<string | null>> {
      try {
         const activeUserGame = await this.gameRepository.getUnfinishedGameByUserId(command.userId)
         if (!activeUserGame) {
            const activeGame = await this.gameRepository.getPendingGame()
            if (activeGame) {

               const newPlayer = Player_Orm.createPlayer(command.userId)
               const secondPlayer = await this.playerRepository.save(newPlayer)
               activeGame.addSecondPlayer(secondPlayer.id)
               await this.gameRepository.save(activeGame)


               const randomQuestions = await this.questionRepository.getRandomQuestions();

               // Создаем сущности GameQuestion и связываем их с игрой
               const gameQuestions = randomQuestions.map((question, index) => {
                  const gameQuestion = GameQuestion_Orm.createGameQuestion(activeGame.id, question, index + 1)
                  return gameQuestion;
               });
               console.log('Game questions in use case', gameQuestions)
               await this.gameQuestionRepository.save(gameQuestions);

               return {
                  data: activeGame.id,
                  status: ResultStatus.SUCCESS
               }
            }
            const newPlayer = Player_Orm.createPlayer(command.userId)
            const firstPlayer = await this.playerRepository.save(newPlayer)
            const newGame = Game_Orm.createGame(firstPlayer.id)
            const game = await this.gameRepository.save(newGame)
            return {
               data: game.id,
               status: ResultStatus.SUCCESS
            }
         }

         if (activeUserGame.gameStatus == GameStatusEnum.Active) return {
            data: null,
            errorMessage: 'User already in game',
            status: ResultStatus.FORBIDDEN
         }

         return {
            data: activeUserGame.id,
            status: ResultStatus.SUCCESS
         }

      } catch (error) {
         console.log(error)
         throw error
      }
   }
}