import { Injectable } from "@nestjs/common";
import { QuestionOutputModel } from "../../api/models/output/question.output";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { PaginationWithItems } from "../../../../base/models/pagination";
import { QuestionQueryClass } from "../../api/models/input/question.input";
import { PublishedStatus } from "../../api/models/enums/enums";
import { Question_Orm } from "../../domain/entities/question.entity";

@Injectable()
export class QuestionQueryRepository {
   constructor(@InjectRepository(Question_Orm) protected questionRepository: Repository<Question_Orm>) { }

   async getQuestionById(id: string): Promise<QuestionOutputModel | null> {
      const question = await this.questionRepository.findOne({ where: { id } });
      if (!question) return null
      return this.mapQuestionToResponse(question);
   }

   async getQuestions(sortData: QuestionQueryClass): Promise<PaginationWithItems<QuestionOutputModel>> {
      const skip = (sortData.pageNumber - 1) * sortData.pageSize;
      const bodySearchTerm = sortData.bodySearchTerm ?? '';
      const publishedStatus = sortData.publishedStatus ?? PublishedStatus.All;

      // Формируем запрос
      const query = this.questionRepository.createQueryBuilder('question')
         .where('question.body ILIKE :bodySearchTerm', { bodySearchTerm: `%${bodySearchTerm}%` });

      // Фильтрация по статусу публикации
      if (publishedStatus === PublishedStatus.Published) {
         query.andWhere('question.published = :published', { published: true });
      } else if (publishedStatus === PublishedStatus.NotPublished) {
         query.andWhere('question.published = :published', { published: false });
      }

      // Выполняем запрос с пагинацией
      const questions = await query
         .orderBy(`question.${sortData.sortBy}`, `${sortData.sortDirection}`)
         .take(sortData.pageSize)
         .skip(skip)
         .getMany();

      const totalCount = await query.getCount();

      const questionsDto: QuestionOutputModel[] = questions.map((question) => this.mapQuestionToResponse(question));

      const questionsOutput: PaginationWithItems<QuestionOutputModel> = new PaginationWithItems(
         sortData.pageNumber,
         sortData.pageSize,
         totalCount,
         questionsDto,
      );

      return questionsOutput;
   }

   private mapQuestionToResponse(question: Question_Orm): QuestionOutputModel {
      return {
         id: question.id,
         body: question.body,
         correctAnswers: question.correctAnswers,
         published: question.published,
         createdAt: question.createdAt.toISOString(),
         updatedAt: question.updatedAt ? question.updatedAt.toISOString() : null,
      };
   }
}