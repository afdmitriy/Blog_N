import { Module, forwardRef } from "@nestjs/common";
import { CommentController } from "./api/comment.controller";
import { CommentService } from "./application/comment.service";
import { CommentRepository } from "./infrastructure/comment.repository";
import { CommentCreateUseCase } from "./application/use-cases/create.comment.use-case";
import { CommentDeleteUseCase } from "./application/use-cases/delete.comment.use-case";
import { CommentUpdateUseCase } from "./application/use-cases/update.comment.use-case";
import { UpdateLikeStatusForCommentUseCase } from "./application/use-cases/update-like-status-for-comment.use-case";
import { UsersModule } from "../users/users.module";
import { PostsModule } from "../posts/posts.module";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Comment_Orm } from "./domain/comment.typeOrm.entity";
import { LikeForComment_Orm } from "./domain/like-for-comment.typeOrm.entity";
import { CommentQueryRepository } from "./infrastructure/comment.query.repository";
import { LikeCommentRepository } from "./infrastructure/like.comment.repository";


@Module({
  imports: [TypeOrmModule.forFeature([Comment_Orm]),
  TypeOrmModule.forFeature([LikeForComment_Orm]),
    UsersModule,
  forwardRef(() => PostsModule),
    //forwardRef(() => LikesModule),
    CqrsModule
  ],
  controllers: [CommentController],
  providers: [
    {
      provide: CommentRepository.name,
      useClass: CommentRepository
    },
    {
      provide: CommentQueryRepository.name,
      useClass: CommentQueryRepository
    },
    {
      provide: CommentService.name,
      useClass: CommentService
    },
    {
      provide: LikeCommentRepository.name,
      useClass: LikeCommentRepository
    },
    CommentCreateUseCase, CommentUpdateUseCase, CommentDeleteUseCase, UpdateLikeStatusForCommentUseCase],
  exports: [CommentCreateUseCase, CommentRepository.name, CommentQueryRepository.name,]
})
export class CommentsModule {
}