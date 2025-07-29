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
import { Answer_Orm } from "./domain/entities/answer.entity";
import { Player_Orm } from "./domain/entities/player.entity";
import { Game_Orm } from "./domain/entities/game.entity";
import { GameQuestion_Orm } from "./domain/entities/game-question.entity";
import { GameController } from "./api/pair-game-quiz.controller";
import { PlayerRepository } from "./infrastructure/player.repository";
import { GameQuestionRepository } from "./infrastructure/game-question.repository";
import { AnswerRepository } from "./infrastructure/answer.repository";
import { GameRepository } from "./infrastructure/pair-game-repositories/game.repository";
import { GameQueryRepository } from "./infrastructure/pair-game-repositories/game.query.repository";
import { SendAnswerUseCase } from "./application/use-cases/send-answer.use-case";
import { StartGameUseCase } from "./application/use-cases/start-quiz.use-case";
import { AnswerQueryRepository } from "./infrastructure/answer.query.repository";

@Module({
   imports: [CqrsModule,
      TypeOrmModule.forFeature([Question_Orm, Answer_Orm, Player_Orm, Game_Orm, GameQuestion_Orm]),
   ],
   controllers: [SaQuizController, GameController],
   providers: [
      {
         provide: QuestionRepository.name,
         useClass: QuestionRepository
      },
      {
         provide: QuestionQueryRepository.name,
         useClass: QuestionQueryRepository
      },
      {
         provide: PlayerRepository.name,
         useClass: PlayerRepository
      },
      {
         provide: GameQuestionRepository.name,
         useClass: GameQuestionRepository
      },
      {
         provide: AnswerRepository.name,
         useClass: AnswerRepository
      },
      {
         provide: AnswerQueryRepository.name,
         useClass: AnswerQueryRepository
      },
      {
         provide: GameRepository.name,
         useClass: GameRepository
      },
      {
         provide: GameQueryRepository.name,
         useClass: GameQueryRepository
      },
      
      QuestionCreateUseCase, QuestionUpdateUseCase, QuestionDeleteUseCase, QuestionPublishUpdateUseCase, SendAnswerUseCase, StartGameUseCase
   ],
   exports: []
})
export class QuizModule {}