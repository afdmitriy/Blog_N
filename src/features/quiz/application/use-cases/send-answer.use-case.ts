import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { GameRepository } from "../../infrastructure/pair-game-repositories/game.repository";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { AnswerRepository } from "../../infrastructure/answer.repository";
import { QuestionRepository } from "../../infrastructure/quiz-repositories/question.repository";
import { Answer_Orm } from "../../domain/entities/answer.entity";
import { PlayerRepository } from "../../infrastructure/player.repository";
import { AnswerStatusEnum } from "../../api/models/enums/enums";
import { Player_Orm } from "../../domain/entities/player.entity";

export class SendAnswerCommand {
   constructor(public userId: string,
      public answer: string
   ) { }
}

@CommandHandler(SendAnswerCommand)
export class SendAnswerUseCase implements ICommandHandler<SendAnswerCommand> {
   constructor(
      @Inject(GameRepository.name) private readonly gameRepository: GameRepository,
      @Inject(AnswerRepository.name) private readonly answerRepository: AnswerRepository,
      @Inject(QuestionRepository.name) private readonly questionRepository: QuestionRepository,
      @Inject(PlayerRepository.name) private readonly plyerRepository: PlayerRepository,
   ) { }
   async execute(command: SendAnswerCommand): Promise<ResultObjectModel<string | null>> {
      try {
         const game = await this.gameRepository.findGameForAnswer(command.userId)
         if (!game) return {
            data: null,
            errorMessage: 'Current user is not inside active pair game',
            status: ResultStatus.FORBIDDEN
         }

         const currentPlayer = game.firstPlayer.user.id === command.userId ? game.firstPlayer : game.secondPlayer
         const anotherPlayer = currentPlayer === game.firstPlayer ? game.secondPlayer : game.firstPlayer;

         if (currentPlayer.answers.length === 5) return {
            data: null,
            errorMessage: 'User already answered 5 times',
            status: ResultStatus.FORBIDDEN
         }

         if (currentPlayer.answers.length === 4) {
            const res = await this.createAnswer(command.answer, currentPlayer.answers.length + 1, game.id, command.userId)

            if (anotherPlayer.answers.length === 5) {
               game.setGameFinished()
               await this.gameRepository.save(game)

               anotherPlayer.addScore()

               await this.plyerRepository.save(anotherPlayer)               
               // const fastPlayer = anotherPlayer.answers.length === 5 ? anotherPlayer : currentPlayer;

               // if (fastPlayer.score !== 0) {
               //    fastPlayer.score += 1;
               // }
            }

            return {
               data: res.answerId,
               status: ResultStatus.SUCCESS
            }
         }

         const res = await this.createAnswer(command.answer, currentPlayer.answers.length + 1, game.id, command.userId)
         return {
            data: res.answerId,
            status: ResultStatus.SUCCESS
         }

      } catch (error) {
         console.log(error)
         throw error
      }
   }

   private async createAnswer(answer: string, numberOfAnswer: number, gameId: string, userId: string): Promise<{
      answerId: string;
      player: Player_Orm;
   }> {
      console.warn('CREATE ANSWER', answer, numberOfAnswer, gameId, userId)
      const question = await this.questionRepository.getQuestionByIndexAndGameId(numberOfAnswer, gameId)
      console.warn('QUESTION', question)
      if (!question) throw new Error('Вопрос не найден');

      console.warn('PlAYER ID FOR CREATE ANSWER', userId)
      const player = await this.plyerRepository.getByUserId(userId)
      console.warn('PLAYER in use case SEND ANSWER', player)
      if (!player) throw new Error('Игорок не найден')

      const res = question.correctAnswers.includes(answer);
      let answerStatus = AnswerStatusEnum.Incorrect
      if (res) {
         answerStatus = AnswerStatusEnum.Correct
         player.addScore()
         await this.plyerRepository.save(player)
      }

      const newAnswer = Answer_Orm.createAnswer(player.id, answerStatus, question.id)
      const createdAnswer = await this.answerRepository.save(newAnswer)
      return {
         answerId: createdAnswer.id,
         player: player
      }
   }
}

// Узнать сколько уже было ответов у игрока    ++
// Если 5 то 403  ++
// Если 4 то принимаю последний, изменяю статус игры на finished     ++
// и проверяю правильность ответа
// и делаю проверку на то есть ли игрок ответивший первым на все вопросы, если у него score больше 0 то + 1 в score
// иначе смотрю сколько всего ответов есть и создаю новый для вопроса по индексу в GameQuestions.
// проверяю правильность, если правильно то + 1 в score для игрока и отдаю ответ


// Как проверить ответ
// Нужно передать номер ответа и id вопроса и id игры
// 