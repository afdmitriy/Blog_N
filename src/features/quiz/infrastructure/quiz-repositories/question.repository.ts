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
      return this.questionORMRepository.createQueryBuilder('question')
         .select('question.id')
         .where('question.published = true')
         .orderBy('RANDOM()')
         .limit(5)
         .getRawMany();
   }

   async deleteById(id: string): Promise<void> {
      await this.questionORMRepository.softDelete(id)
   }

   async save(question: Question_Orm): Promise<Question_Orm> {
      return this.questionORMRepository.save(question)
   }
}