import { Test, TestingModule } from "@nestjs/testing";
import { ResultObjectModel } from "../../src/base/models/result.object.type";
import { ResultStatus } from "../../src/base/models/enums/enums";
import { AppModule } from "../../src/app.module";
import { GameRepository } from "../../src/features/quiz/infrastructure/pair-game-repositories/game.repository";
import { StartGameCommand, StartGameUseCase } from "../../src/features/quiz/application/use-cases/start-quiz.use-case";
import request from 'supertest';
import { INestApplication } from "@nestjs/common";
import { UserTestManager } from "../common/user.test.manager";

describe('Test StartGameUseCase', () => {
   let gameRepository: GameRepository
   let startGameUseCase: StartGameUseCase
   let app: INestApplication;
   let httpServer;
   let userTestManager: UserTestManager;
   let userId1: string;
   let userId2: string

   beforeAll(async () => {
      const module: TestingModule = await Test.createTestingModule({
         imports: [AppModule]
      }).compile();
      app = module.createNestApplication();
      startGameUseCase = module.get(StartGameUseCase);
      await app.init();

      httpServer = app.getHttpServer();
      userTestManager = new UserTestManager(app);
      await request(httpServer).delete('/testing/all-data').expect(204);
   })
   afterAll(async () => {
      await app.close();
    });

   it('should create a question successfully', async () => {

      const command = new StartGameCommand(questionInput);
      const mockQuestion = { id: '123', ...questionInput };

      const questionResult = await questionCreateUseCase.execute(command)

      expect(questionResult.status).toBe('success')

      const res = await questionRepository.getById(questionResult.data!)

      expect(res?.body).toBe(command.question.body)

   })
})

// ЮзКейс создание пользователя вернет id пользователя которого буду использовать

// Спросить про то