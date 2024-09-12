import { Module, forwardRef } from "@nestjs/common";
import { PostController } from "./api/post.controller";
import { BlogsModule } from "../blogs/blogs.module";
import { PostCreateUseCase } from "./application/use-cases/post.create.use-case";
// import { UpdateLikeStatusForPostUseCase } from "./application/use-cases/update-like-status-for-post.use-case";
import { UsersModule } from "../users/users.module";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Post_Orm } from "./domain/post.typOrm.entity";
import { PostRepository } from "./infrastructure/post.repository";
import { PostQueryRepository } from "./infrastructure/post.query.repository";
import { LikeForPost_Orm } from "./domain/like-for-post.typeOrm.entity";
import { PostUpdateUseCase } from "./application/use-cases/post.update.use-case";
import { PostDeleteUseCase } from "./application/use-cases/post.delete.use-case";


@Module({
   imports: [TypeOrmModule.forFeature([Post_Orm]),
   TypeOrmModule.forFeature([LikeForPost_Orm]),
   forwardRef(() => BlogsModule),
      // forwardRef(() => CommentsModule),
      // forwardRef(() => LikesModule),
      UsersModule,
      CqrsModule],
   controllers: [PostController],
   providers: [
      {
         provide: PostRepository.name,
         useClass: PostRepository
      },
      {
         provide: PostQueryRepository.name,
         useClass: PostQueryRepository
      },
      // UpdateLikeStatusForPostUseCase,
      PostCreateUseCase,
      PostUpdateUseCase, PostDeleteUseCase
   ],
   exports: [PostRepository.name, PostCreateUseCase, PostUpdateUseCase, PostDeleteUseCase, PostQueryRepository.name]
})
export class PostsModule {
}