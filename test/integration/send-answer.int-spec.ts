import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { UserTestManager } from '../common/user.test.manager';
import { applyAppSettings } from '../../src/settings/apply.app.settings';
import { DataSource } from 'typeorm';
import { appSettings } from '../../src/settings/app.settings';
import { SendAnswerCommand, SendAnswerUseCase } from '../../src/features/quiz/application/use-cases/send-answer.use-case';
import { QuestionSeeder } from '../common/questionSeeder';
import { StartGameCommand, StartGameUseCase } from '../../src/features/quiz/application/use-cases/start-quiz.use-case';
import { GameRepository } from '../../src/features/quiz/infrastructure/pair-game-repositories/game.repository';
import { GameQueryRepository } from '../../src/features/quiz/infrastructure/pair-game-repositories/game.query.repository';
import { QuizModule } from '../../src/features/quiz/quiz.module';
import { Entities } from '../../src/infrastructure/listOfEntities';

describe('Send Answer Integration tests', () => {
   let app: INestApplication;
   let httpServer;
//   let questionRepository: QuestionRepository;
   let gameRepository: GameRepository;
   let gameQueryRepository: GameQueryRepository;
   let sendAnswerUseCase: SendAnswerUseCase;
   let connectionUseCase: StartGameUseCase
   let userTestManager: UserTestManager;
   let questionSeeder: QuestionSeeder
   console.log(__dirname, 'DIRNAME')
   const dataSource = new DataSource({
      type: 'postgres',
      url: appSettings.env.isTesting()
         ? (function () {
            console.log(appSettings.api.POSTGRES_URI_FOR_TESTS)
            return appSettings.api.POSTGRES_URI_FOR_TESTS
         })()
         : appSettings.api.POSTGRES_URI,
      synchronize: false,
      //autoLoadEntities: true, 
      //entities: [`src/features/**/*.entity{.ts,.js}`],
      entities: Entities,
      logging: true
   })

   const userData = {
      login: 'loginTest',
      password: 'qwerty',
      email: 'linesreen@mail.ru',
   };

   const userData2 = {
      login: '2loginTest',
      password: '2qwerty',
      email: '2linesreen@mail.ru',
   };

   beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule, QuizModule],
      }).compile();
      sendAnswerUseCase = moduleFixture.get<SendAnswerUseCase>(SendAnswerUseCase);
//      questionRepository = moduleFixture.get(QuestionRepository)
      connectionUseCase = moduleFixture.get<StartGameUseCase>(StartGameUseCase)
      gameRepository = gameRepository = moduleFixture.get<GameRepository>(GameRepository.name);
      gameQueryRepository = moduleFixture.get<GameQueryRepository>(GameQueryRepository.name);
      app = moduleFixture.createNestApplication();
      await dataSource.initialize();
      applyAppSettings(app);
      httpServer = app.getHttpServer();
      
      userTestManager = new UserTestManager(app);
      questionSeeder = new QuestionSeeder(dataSource)
      await app.init();

   });

   beforeEach(async () => {
      await request(httpServer).delete('/testing/all-data').expect(204);
      await questionSeeder.insertTestQuestions()
   })

   // afterAll(async () => {
   //    await app.close();
   // });

   it('create new game by user1, connect to game by user2, add 6 answers by user1. Should return error if current user has already answered to all questions; status 403', async () => {
      const user1 = await userTestManager.createUser(201, userData);
      const user2 = await userTestManager.createUser(201, userData2);

      const command1 = new StartGameCommand(user1.body.id);
      const connectionResult1 = await connectionUseCase.execute(command1)
      expect(connectionResult1.status).toBe('Success')
      const res1 = await gameRepository.getById(connectionResult1.data!)
      expect(res1?.firstPlayer.userId).toBe(command1.userId)

      const command2 = new StartGameCommand(user2.body.id);
      const connectionResult2 = await connectionUseCase.execute(command2)
      expect(connectionResult2.status).toBe('Success')
      const res2 = await gameRepository.getById(connectionResult2.data!)
      expect(res2?.secondPlayer.userId).toBe(command2.userId)

      const game = await gameQueryRepository.getGame({userId: user1.body.id})
      console.warn('GAME', game)
      expect(game[0].questions?.length).toBeGreaterThan(0);
      
      const commandAnswer = new SendAnswerCommand(user1.body.id, 'Ответ 1')
      const answerResult = await sendAnswerUseCase.execute(commandAnswer)
      expect(answerResult.status).toBe('Success')

   })

})