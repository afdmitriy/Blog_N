import { INestApplication } from '@nestjs/common';
import { UserInputModel } from 'src/features/users/api/models/input/user.input';
import request from 'supertest';

export class UserTestManager {
  public adminData: { login: string; password: string };
  public userDefaultCreateData: UserInputModel;
  constructor(protected readonly app: INestApplication) {
    this.userDefaultCreateData = {
      login: 'loginTest',
      password: 'qwerty',
      email: 'example@mail.ru',
    };
    this.adminData = {
      login: 'admin',
      password: 'qwerty',
    };
  }

  async createUser(
    status: number = 201,
    userData?: UserInputModel | null,
    adminData?: { login: string; password: string },
  ) {
    const authData = adminData ?? this.adminData;
    const userCreateData = userData ?? this.userDefaultCreateData;
    return request(this.app.getHttpServer())
      .post(`/sa/users`)
      .auth(authData.login, authData.password)
      .send(userCreateData)
      .expect(status);
  }
}