import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CqrsModule } from "@nestjs/cqrs";
import { Question_Orm } from "./domain/entities/question.entity";
import { SaQuizController } from "./api/quiz.sa.controller";
import { QuestionRepository } from "./infrastructure/quiz-repositories/question.repository";
import { QuestionQueryRepository } from "./infrastructure/quiz-repositories/question.query.repository";
import { QuestionCreateUseCase } from "./application/use-cases/question/create-question.use-case";
import { QuestionUpdateUseCase } from "./application/use-cases/question/update-question.use-case";
import { QuestionDeleteUseCase } from "./application/use-cases/question/delete-question.use-case";
import { QuestionPublishUpdateUseCase } from "./application/use-cases/question/publish-question.use-case";

@Module({
   imports: [CqrsModule,
      TypeOrmModule.forFeature([Question_Orm])
   ],
   controllers: [SaQuizController],
   providers: [
      {
         provide: QuestionRepository.name,
         useClass: QuestionRepository
      },
      {
         provide: QuestionQueryRepository.name,
         useClass: QuestionQueryRepository
      },
      
      QuestionCreateUseCase, QuestionUpdateUseCase, QuestionDeleteUseCase, QuestionPublishUpdateUseCase
   ],
   exports: []
})
export class QuestionsModule {
}