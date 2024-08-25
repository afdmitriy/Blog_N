import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef, } from '@nestjs/common';
import { MailModule } from './infrastructure/adapters/mailer/mail.module';
// import { BlogsModule } from './features/blogs/blogs.module';
// import { PostsModule } from './features/posts/posts.module';
import { TestingModule } from './features/testing/testing.module';
import { AuthModule } from './features/auth/auth.module';
// import { CommentsModule } from './features/comments/comment.module';
// import { LikesModule } from './infrastructure/modules/like/like.module';
import { SessionsModule } from './features/security/session.module';
import { UsersModule } from './features/users/users.module';
import { appSettings } from './settings/app.settings';
// import { LoggerMiddleware } from './infrastructure/middlewares/logger.middleware';
// import { ApiLogRepository } from './features/api.logger/api.logger.repository';
// import { apiLogSchema } from './features/api.logger/api.logger.model';
// import { LikePostSchema } from './features/posts/domain/like.for.post.mongoose.entity';
import { NameIsExistConstraint } from './infrastructure/decorators/validate/user-is-exist.decorator';
import { EmailIsConfirmedConstraint } from './infrastructure/decorators/validate/email-is-confirmed.decorator';
import { ConfCodeIsValidConstraint } from './infrastructure/decorators/validate/confirmation-code.decorator';
// import { PayloadFromJwtMiddleware } from './infrastructure/middlewares/payload-from-jwt.middleware';
// import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
// import { BlogIsExistConstraint } from './infrastructure/decorators/validate/blog-is-exist.decorator';
import { QueryPaginationPipe } from './infrastructure/pipes/query.global.pipe';
import { TypeOrmModule } from '@nestjs/typeorm';

const decorators = [NameIsExistConstraint,
  EmailIsConfirmedConstraint,
  ConfCodeIsValidConstraint,
  // BlogIsExistConstraint
]

@Module({
  imports: [
    // CqrsModule,
    // MongooseModule.forRoot(
    //   appSettings.env.isTesting()
    //     ? appSettings.api.MONGO_URI_FOR_TESTS
    //     : appSettings.api.MONGO_URI,
    //), // 'mongodb://127.0.0.1:27017', {dbName: 'blog-nest'}
    // MongooseModule.forFeature([
    //   { name: 'LikeForPost', schema: LikePostSchema },
    //   { name: 'ApiLog', schema: apiLogSchema }
    // ]),
    forwardRef(() => JwtModule),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: appSettings.env.isTesting()
      ? appSettings.api.POSTGRES_URI_FOR_TESTS
      : appSettings.api.POSTGRES_URI,
      // host: 'localhost',
      // port: 5432,
      // username: 'postgres',
      // password: '777666',
      // database: 'blog-nest-db',
      synchronize: true,
      autoLoadEntities: true,
      logging: true
    }),
     
    UsersModule, 
    AuthModule, 
    MailModule,
    SessionsModule,
    // BlogsModule,
    // PostsModule,
    // CommentsModule,
    // LikesModule,
    TestingModule,
  ],
 
  providers: [...decorators,
    // ApiLogRepository,
    QueryPaginationPipe
  ],
  // exports:[CqrsModule]
})
export class AppModule {}
// implements NestModule {
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware)
//       .forRoutes({ path: '*', method: RequestMethod.ALL });
      
//     consumer.apply(PayloadFromJwtMiddleware)
//       .forRoutes(
//         { path: 'comments/:commentId', method: RequestMethod.GET },
//         { path: 'posts/:postId', method: RequestMethod.GET },
//         { path: 'posts/:postId/comments', method: RequestMethod.GET },
//         { path: 'posts', method: RequestMethod.GET },
//         { path: 'blogs/:blogId/posts', method: RequestMethod.GET },
//       );
//   }
// }

