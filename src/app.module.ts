import { MiddlewareConsumer, Module, NestModule, RequestMethod, } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from './infrastructure/adapters/mailer/mail.module';
import { BlogsModule } from './features/blogs/blogs.module';
import { PostsModule } from './features/posts/posts.module';
import { UsersModule } from './features/users/users.module';
import { appSettings } from './settings/app.settings';
import { TestingModule } from './features/testing/testing.module';
import { LoggerMiddleware } from './infrastructure/middlewares/logger.middleware';
import { ApiLogRepository } from './features/api.logger/api.logger.repository';
import { apiLogSchema } from './features/api.logger/api.logger.model';
import { LikePostSchema } from './features/posts/domain/like.for.post.mongoose.entity';
import { AuthModule } from './features/auth/auth.module';
import { NameIsExistConstraint } from './infrastructure/decorators/validate/user-is-exist.decorator';
import { EmailIsConfirmedConstraint } from './infrastructure/decorators/validate/email-is-confirmed.decorator';
import { ConfCodeIsValidConstraint } from './infrastructure/decorators/validate/confirmation-code.decorator';

// const strategies = [LocalStrategy, JwtStrategy, JwtCookieStrategy]
const decorators = [NameIsExistConstraint,
  EmailIsConfirmedConstraint,
  ConfCodeIsValidConstraint
]

@Module({
  imports: [
    // CqrsModule, PassportModule,
    // JwtModule.register({
    //   // secret: jwtConstants.secretAccess,
    //   // // Здесь возможна ошибка типа передающегося в константе

    //   // signOptions: { expiresIn: (jwtConstants.accessExpiresIn) },
    // }),
    MongooseModule.forRoot(
      appSettings.env.isTesting()
      ? appSettings.api.MONGO_URI_FOR_TESTS
        : appSettings.api.MONGO_URI,
      ), // 'mongodb://127.0.0.1:27017', {dbName: 'blog-nest'}
    MongooseModule.forFeature([
    { name: 'LikeForPost', schema: LikePostSchema },
    { name: 'ApiLog', schema: apiLogSchema}
    ]),
    
    MailModule,
    AuthModule,
    BlogsModule,
    PostsModule,
    UsersModule,
    TestingModule
  ],
  // controllers: [AuthController],
  providers: [...decorators,
  //   {
  //   provide: AuthService.name,
  //   useClass: AuthService
  // },
    // UserRegistrationUseCase, UserLoginUseCase,
    ApiLogRepository,
    //  ...strategies
    // LikePostRepository,
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
    .forRoutes({ path: '*', method: RequestMethod.ALL });
  }}