// import { Test, TestingModule } from '@nestjs/testing';
// import { INestApplication } from '@nestjs/common';
// import request from 'supertest';
// import { AppModule } from 'src/app.module';
// import { applyAppSettings } from 'src/settings/apply.app.settings';


// describe('AppController (e2e)', () => {
//   let app: INestApplication;

//   beforeEach(async () => {
//     const moduleFixture: TestingModule = await Test.createTestingModule({
//       imports: [AppModule],
//     })
//     .overrideProvider(AuthService)
//     //.useValue(AuthServiceMockObject)
//     .useClass(AuthServiceMock)
//     /*  .useFactory({
//               factory: (usersRepo: UsersRepository) => {
//                   return new UserServiceMock(usersRepo, {
//                        count: 50
//                   });
//               },
//               inject: [UsersRepository]
//           }
//       )*/
//     .compile();

//     app = moduleFixture.createNestApplication();
//     applyAppSettings(app)
//     await app.init();
//   });

//   it('/ (GET)', () => {
//     return request(app.getHttpServer())
//       .get('/')
//       .expect(200)
//       .expect('Hello World!');
//   });
// });
