import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Question } from "../../domain/entities/question.entity";


@Injectable()
export class QuestionRepository {
   constructor(@InjectRepository(Question) protected questionRepository: Repository<Question>) { }

   async getById(id: string): Promise<Question | null> {
      const question = await this.questionRepository.findOne({ where: { id } });
      return question || null;
   }

   async deleteById(id: string): Promise<void> {
      await this.questionRepository.softDelete(id)
   }

   async save(question: Question): Promise<Question> {
      return this.questionRepository.save(question)
   }
}