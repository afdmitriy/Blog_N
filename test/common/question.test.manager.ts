import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { QuestionInputModel } from '../../src/features/quiz/api/models/input/question.input';

export class QuestionTestManager {
  public adminData: { login: string; password: string };
  public questionDefaultCreateData: QuestionInputModel;
  constructor(protected readonly app: INestApplication) {
    this.questionDefaultCreateData = {
      body: 'body mody cody',
      correctAnswers: ['answer'],
    };
    this.adminData = {
      login: 'admin',
      password: 'qwerty',
    };
  }

  async createQuestion(
    status: number = 201,
    questionData?: QuestionInputModel | null,
    adminData?: { login: string; password: string },
  ) {
    const authData = adminData ?? this.adminData;
    const questionCreateData = questionData ?? this.questionDefaultCreateData;
    return request(this.app.getHttpServer())
      .post(`/sa/quiz/questions`)
      .auth(authData.login, authData.password)
      .send(questionCreateData)
      .expect(status);
  }
}