import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Answer_Orm } from "../domain/entities/answer.entity";
import { AnswerStatusEnum } from "../api/models/enums/enums";


@Injectable()
export class AnswerQueryRepository {
   constructor(@InjectRepository(Answer_Orm) protected answerORMRepository: Repository<Answer_Orm>) { }

   async getAnswer(answerId: string): Promise<{
      questionId: string;
      answerStatus: AnswerStatusEnum;
      addedAt: string;
   } | null> {
      const answer = await this.answerORMRepository.findOne({ where: { id: answerId } });

      if (!answer) {
         return null
      }
      return {
         questionId: answer.questionId,
         answerStatus: answer.status,
         addedAt: answer.createdAt.toISOString()
      }
   }
}