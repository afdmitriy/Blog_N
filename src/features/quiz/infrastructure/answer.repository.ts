import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Answer_Orm } from "../domain/entities/answer.entity";


@Injectable()
export class AnswerRepository {
   constructor(@InjectRepository(Answer_Orm) protected answerORMRepository: Repository<Answer_Orm>) { }

   async getById(id: string): Promise<Answer_Orm | null> {
      const answer = await this.answerORMRepository.findOne({ where: { id } });
      return answer || null;
   }

   async deleteById(id: string): Promise<void> {
      await this.answerORMRepository.softDelete(id)
   }

   async save(answer: Answer_Orm): Promise<Answer_Orm> {
      return this.answerORMRepository.save(answer)
   }
}