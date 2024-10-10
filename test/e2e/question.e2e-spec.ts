import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { applyAppSettings } from '../../src/settings/apply.app.settings';
import { AppModule } from '../../src/app.module';
import { QuestionTestManager } from '../common/question.test.manager';


describe('Questions e2e tests', () => {
   let app: INestApplication;
   let httpServer: string;

   let questionTestManager: QuestionTestManager;

   beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
         imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      applyAppSettings(app);
      await app.init();
      httpServer = app.getHttpServer();

      //connect managers for testing
      questionTestManager = new QuestionTestManager(app);

      //clean the database before the tests
      await request(httpServer).delete('/testing/all-data').expect(204);
   });

   afterAll(async () => {
      await app.close();
   });
   const adminAuth = {
      login: 'admin',
      password: 'qwerty',
   };
   const questionCreateData = {
      body: 'body mody cody',
      correctAnswers: [''],
   };

   const questions: any[] = [];
   let questionsResp: any[] = [];
   //creating 7 questions for further testing
   for (let i = 1; i < 7; i++) {
      const updatedCorrectAnswers: any[] = []; // Копируем существующие ответы

      // Добавляем все предыдущие ответы и новый
      for (let j = 1; j <= i; j++) {
         updatedCorrectAnswers.push(`newAnswer${j}`);
      }

      questions.push({
         body: `${i}${questionCreateData.body}`,
         correctAnswers: updatedCorrectAnswers, // Обновляем массив правильных ответов
      });
   }
   //creating 6 questions in DB for further testing
   it('create 6 questions', async () => {
      questionsResp = await Promise.all(
         questions.map(async (question) => {
            const response = await questionTestManager.createQuestion(201, question);
            expect(response.body.body).toEqual(question.body);
            expect(response.body.correctAnswers).toEqual(question.correctAnswers);
            return response.body;
         }),
      );
   });

   //-----------------------testing field validation------------------------
   it('shouldn"t create question with not valid body (short)', async () => {
      const response = await questionTestManager.createQuestion(400, { ...questionCreateData, body: 'body' });
      expect(response.body.errorsMessages.length).toEqual(1);
      expect(response.body.errorsMessages[0].field).toEqual('body');
   });
   it('shouldn"t create question with not valid answers (wrong type)', async () => {
      // @ts-expect-error
      const response = await questionTestManager.createQuestion(400, { ...questionCreateData, correctAnswers: 'any string' });
      expect(response.body.errorsMessages.length).toEqual(1);
      expect(response.body.errorsMessages[0].field).toEqual('correctAnswers');
   });
   it('shouldn"t create question with not valid answers (min length)', async () => {
      const response = await questionTestManager.createQuestion(400, { ...questionCreateData, correctAnswers: [] });
      expect(response.body.errorsMessages.length).toEqual(1);
      expect(response.body.errorsMessages[0].field).toEqual('correctAnswers');
   });
   it('shouldn"t create question with not valid answers (max length)', async () => {
      const response = await questionTestManager.createQuestion(400, { ...questionCreateData, correctAnswers: ['1', '2', '3', '4', '5', '6', '7'] });
      expect(response.body.errorsMessages.length).toEqual(1);
      expect(response.body.errorsMessages[0].field).toEqual('correctAnswers');
   });
  
   //------------------testing get all questions with pagination-----------------
   //sortDirection=asc
   it('should return 6 questions asc', async () => {
      const response = await request(httpServer)
         .get('/sa/quiz/questions/?sortDirection=asc&sortBy=body')
         .auth(adminAuth.login, adminAuth.password)
         .expect(200);

      expect(response.body.items.length).toEqual(6);
      expect(response.body.page).toEqual(1);
      expect(response.body.pageSize).toEqual(10);
      expect(response.body.totalCount).toEqual(6);

      expect(response.body.items[0]).toEqual(questionsResp[0]);
      expect(response.body.items[1]).toEqual(questionsResp[1]);
      expect(response.body.items[2]).toEqual(questionsResp[2]);
      expect(response.body.items[3]).toEqual(questionsResp[3]);
      expect(response.body.items[4]).toEqual(questionsResp[4]);
      expect(response.body.items[5]).toEqual(questionsResp[5]);
   });
   //sortDirection=asc
   //pageNumber=2
   it("shouldn't return questions on blank page", async () => {
      const response = await request(httpServer)
         .get('/sa/quiz/questions/?sortDirection=asc&pageNumber=2')
         .auth(adminAuth.login, adminAuth.password)
         .expect(200);

      expect(response.body.items.length).toEqual(0);
      expect(response.body.page).toEqual(2);
      expect(response.body.pageSize).toEqual(10);
      expect(response.body.totalCount).toEqual(6);
   });
   //sortDirection=asc
   //pageNumber=2
   //pageSize=8
   it('should return 1 question on page number 2  asc', async () => {
      const response = await request(httpServer)
         .get('/sa/quiz/questions/?sortDirection=asc&pageNumber=2&pageSize=5')
         .auth(adminAuth.login, adminAuth.password)
         .expect(200);

      expect(response.body.items.length).toEqual(1);
      expect(response.body.page).toEqual(2);
      expect(response.body.pageSize).toEqual(5);
      expect(response.body.totalCount).toEqual(6);
   });
});