import { Module, forwardRef } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentSchema } from "./domain/comment.mongoose.entity";
import { CommentController } from "./api/comment.controller";
import { CommentService } from "./application/comment.service";
import { CommentQueryRepository } from "./infrastructure/comment.query.repository";
import { CommentRepository } from "./infrastructure/comment.repository";
import { CommentCreateUseCase } from "./application/use-cases/create.comment.use-case";
import { CommentDeleteUseCase } from "./application/use-cases/delete.comment.use-case";
import { CommentGetUseCase } from "./application/use-cases/get.comment.use-case";
import { CommentsGetUseCase } from "./application/use-cases/get.comments.use-case";
import { CommentUpdateUseCase } from "./application/use-cases/update.comment.use-case";
import { LikeCommentsModule } from "../../infrastructure/modules/like/like.comment.module";
import { UpdateLikeStatusForCommentUseCase } from "./application/use-cases/update-like-status-for-comment.use-case";
import { UsersModule } from "../users/users.module";
import { PostsModule } from "../posts/posts.module";
import { LikesModule } from "../../infrastructure/modules/like/like.module";
import { CqrsModule } from "@nestjs/cqrs";


@Module({
  imports: [MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
    LikeCommentsModule, UsersModule,
  forwardRef(() => PostsModule),
  forwardRef(() => LikesModule),
  CqrsModule
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentQueryRepository, CommentRepository, CommentCreateUseCase, CommentUpdateUseCase, CommentDeleteUseCase, CommentGetUseCase, CommentsGetUseCase, UpdateLikeStatusForCommentUseCase],
  exports: [CommentsGetUseCase, CommentCreateUseCase, CommentRepository]
})
export class CommentsModule {
}