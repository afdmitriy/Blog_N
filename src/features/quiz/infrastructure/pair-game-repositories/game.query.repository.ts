import { Repository } from "typeorm";
import { Game_Orm } from "../../domain/entities/game.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AnswerStatusEnum, GameStatusEnum } from "../../api/models/enums/enums";
import { GameOutputModel } from "../../api/models/output/game.output";
import { QueryBaseClass } from "../../../../infrastructure/types/query-sort.type";

interface GameQueryParams {
   userId?: string
   gameId?: string;
   sortData?: QueryBaseClass
   includeFinished?: boolean
}

@Injectable()
export class GameQueryRepository {
   constructor(@InjectRepository(Game_Orm) protected gameORMRepository: Repository<Game_Orm>) { }

   async getGame(queryParams: GameQueryParams): Promise<GameOutputModel[] | []> {

      const gameRepository = this.gameORMRepository;
      const userId = queryParams.userId
      const gameId = queryParams.gameId
      const sortBy = queryParams.sortData?.sortBy || 'pairCreatedDate'
      const sortDirection = queryParams.sortData?.sortDirection || 'ASC'
      const pageNumber = queryParams.sortData?.pageNumber || 1
      const pageSize = queryParams.sortData?.pageSize || 10
      const includeFinished = queryParams.includeFinished

      console.log(gameId, "GAMEID")

      const query = gameRepository.createQueryBuilder('game')
         .leftJoinAndSelect('game.firstPlayer', 'firstPlayer')
         .leftJoinAndSelect('game.secondPlayer', 'secondPlayer')
         .leftJoinAndSelect('firstPlayer.user', 'fpu')
         .leftJoinAndSelect('secondPlayer.user', 'spu')
         .leftJoinAndSelect('game.gameQuestions', 'gameQuestions')
         .leftJoinAndSelect('gameQuestions.question', 'question')
         .leftJoinAndSelect('firstPlayer.answers', 'firstPlayerAnswers')
         .leftJoinAndSelect('secondPlayer.answers', 'secondPlayerAnswers')
         .where('game.id = :gameId', { gameId })
      // .andWhere('firstPlayer.userId = :userId OR secondPlayer.userId = :userId', { userId });

      if (userId) {
         query.orWhere('firstPlayer.userId = :userId', { userId })
            .orWhere('secondPlayer.userId = :userId', { userId });
      }

      if (!includeFinished) {
         query.andWhere('game.gameStatus != :finishedStatus', { finishedStatus: GameStatusEnum.Finished });
      }

      query.orderBy(`game.${sortBy}`, sortDirection)
         .skip((pageNumber - 1) * pageSize)
         .take(pageSize);

      const games = await query.getMany();
      if (!games) return []

      return games.map(game => {
         return {
            id: game.id,
            firstPlayerProgress: {
               answers: game.gameQuestions.map(gq => {
                  const answer = game.firstPlayer.answers.find(a => a.id === gq.id);
                  if (answer) {
                     return {
                        questionId: gq.questionId,
                        answerStatus: answer.status,
                        addedAt: answer.createdAt.toISOString(),
                     };
                  }
                  // Если ответа нет, ничего не возвращаем
                   return null;
               }).filter(answer => answer !== null) as { // Убираем null значения из массива
                  questionId: string;
                  answerStatus: AnswerStatusEnum;
                  addedAt: string;
               }[], // Убираем null значения из массива
               player: {
                  id: game.firstPlayer.userId,
                  login: game.firstPlayer.user.login,
               },
               score: game.firstPlayer.score,
            },
            secondPlayerProgress: game.secondPlayer ? {
               answers: game.gameQuestions.map(gq => {
                  const answer = game.secondPlayer.answers.find(a => a.id === gq.id);
                  if (answer) {
                     return {
                        questionId: gq.questionId,
                        answerStatus: answer.status,
                        addedAt: answer.createdAt.toISOString(),
                     };
                  }
                  // Если ответа нет, ничего не возвращаем
                   return null;
               }).filter(answer => answer !== null) as { // Убираем null значения из массива
                  questionId: string;
                  answerStatus: AnswerStatusEnum;
                  addedAt: string;
               }[], // Убираем null значения из массива
               player: {
                  id: game.secondPlayer.userId,
                  login: game.secondPlayer.user.login,
               },
               score: game.secondPlayer.score,
            } : null,
            // questions: game.gameQuestions.sort((a, b) => a.index - b.index).map(gq => ({
            //    id: gq.id,
            //    body: gq.question.body,
            // })),
            questions: game.gameQuestions.length > 0 ? game.gameQuestions.sort((a, b) => a.index - b.index).map(gq => ({
               id: gq.id,
               body: gq.question.body,
           })) : null,
            status: game.gameStatus, // Статус игры
            pairCreatedDate: game.createdAt.toISOString(), // Дата создания пары
            startGameDate: game.secondPlayer?.createdAt ? game.secondPlayer.createdAt.toISOString() : null, // Дата начала игры
            finishGameDate: game.finishGameDate ? game.finishGameDate.toISOString() : null, // Дата окончания игры
         };
      });
   }
}