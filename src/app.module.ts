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
import { CqrsModule } from '@nestjs/cqrs';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './features/auth/api/auth.controller';
import { AuthService } from './features/auth/application/auth.service';
import { UserRegistrationUseCase } from './features/auth/application/use-cases/registrate-user.use-case';
import { UserLoginUseCase } from './features/auth/application/use-cases/login-user.use-case';
import { LocalStrategy } from './infrastructure/strategies/local.strategy';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtCookieStrategy } from './infrastructure/strategies/jwt.cookie.strategy';

const strategies = [LocalStrategy, JwtStrategy, JwtCookieStrategy]

@Module({
  imports: [CqrsModule, PassportModule,
    JwtModule.register({
      // secret: jwtConstants.secretAccess,
      // // Здесь возможна ошибка типа передающегося в константе

      // signOptions: { expiresIn: (jwtConstants.accessExpiresIn) },
    }),
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
    // AuthModule,
    BlogsModule,
    PostsModule,
    UsersModule,
    TestingModule
  ],
  controllers: [AuthController],
  providers: [ApiLogRepository, AuthService, UserRegistrationUseCase, UserLoginUseCase, ...strategies
    // LikePostRepository,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
    .forRoutes({ path: '*', method: RequestMethod.ALL });
  }}