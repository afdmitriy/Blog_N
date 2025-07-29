import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question_Orm } from "../../domain/entities/question.entity";


// export interface IQuestionRepository {}
@Injectable()
export class QuestionRepository {
   constructor(@InjectRepository(Question_Orm) protected questionORMRepository: Repository<Question_Orm>) { }

   async getById(id: string): Promise<Question_Orm | null> {
      const question = await this.questionORMRepository.findOne({ where: { id } });
      return question || null;
   }

   async getRandomQuestions(): Promise<string[]> {
      const questions = await this.questionORMRepository.createQueryBuilder('question')
         .select('question.id')
         .where('question.published = true')
         .orderBy('RANDOM()')
         .limit(5)
         .getRawMany();

      return questions.map((question) => question.question_id);
   }

   async getQuestionsByGameId(gameId: string): Promise<Question_Orm[]> {
      return await this.questionORMRepository.createQueryBuilder('question')
         .innerJoinAndSelect('question.gameQuestions', 'gameQuestion')
         .where('gameQuestion.gameId = :gameId', { gameId })
         .orderBy('gameQuestion.index', 'ASC')
         .getMany();
   }

   // async getQuestionByIndexAndGameId(index: number,  gameId: string): Promise<Question_Orm | null> {
   //    const queryBuilder = this.questionORMRepository.createQueryBuilder('question')
   //    .innerJoinAndSelect('question.gameQuestions', 'gameQuestion')
   //    .where('gameQuestion.gameId = :gameId', { gameId })
   //    .andWhere('gameQuestion.index = :index', { index })

   //    console.warn("Generated SQL Query:", queryBuilder.getQuery());

   //    const question = await queryBuilder.getOne();

   //    console.warn("QUESTION REPO", question)
   //    return question;
   // }

   // async getQuestionByIndexAndGameId(index: number, gameId: string): Promise<Question_Orm | null> {
   //    const question = await this.questionORMRepository.findOne({
   //       relations: { gameQuestions: true },
   //       where: {
   //          gameQuestions: {
   //             gameId: gameId,
   //             index: index
   //          }
   //       }
   //    });

   //    console.warn("QUESTION REPO", question);
   //    return question;
   // }

   async getQuestionByIndexAndGameId(index: number, gameId: string): Promise<Question_Orm | null> {
      const rawQuery = `
          SELECT question_orm.*
          FROM question_orm
          INNER JOIN game_question_orm ON question_orm.id = game_question_orm."questionId"
          WHERE game_question_orm."gameId" = $1 AND game_question_orm.index = $2
      `;

      console.warn("Generated SQL Query:", rawQuery);

      const question = await this.questionORMRepository.query(rawQuery, [gameId, index]);

      console.warn("QUESTION REPO", question);
      if (question.length === 0) {
         return null;
      }
      const mappedQuestions = question.map((question: any) => ({
         ...question,
         correctAnswers: question.correct_answers
     }));
 
     return mappedQuestions[0];
   }


   async deleteById(id: string): Promise<void> {
      await this.questionORMRepository.softDelete(id)
   }

   async save(question: Question_Orm): Promise<Question_Orm> {
      return await this.questionORMRepository.save(question)
   }
}