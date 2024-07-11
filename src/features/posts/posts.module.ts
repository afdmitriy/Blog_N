import { Module, forwardRef } from "@nestjs/common";
import { PostController } from "./api/post.controller";
import { PostService } from "./application/post.service";
import { PostQueryRepository } from "./infrastructure/post.query.repository";
import { PostRepository } from "./infrastructure/post.repository";
import { PostSchema } from "./domain/post.mongoose.entity";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogsModule } from "../blogs/blogs.module";

import { CommentsModule } from "../comments/comment.module";
import { PostCreateUseCase } from "./application/use-cases/create.post.use-case";
import { PostsGetUseCase } from "./application/use-cases/get.posts.use-case";
import { UpdateLikeStatusForPostUseCase } from "./application/use-cases/update-like-status-for-post.use-case";
import { PostGetByIdUseCase } from "./application/use-cases/get.post.use-case";
import { UsersModule } from "../users/users.module";
import { LikePostsModule } from "../../infrastructure/modules/like/like.post.module";
import { LikesModule } from "../../infrastructure/modules/like/like.module";
import { CqrsModule } from "@nestjs/cqrs";
import { PostsGetByBlogIdUseCase } from "./application/use-cases/get.posts.by.blog.use-case";


@Module({
   imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
   forwardRef(() => BlogsModule),
   forwardRef(() => CommentsModule),
   forwardRef(() => LikesModule),
   LikePostsModule, UsersModule,
   LikesModule, CqrsModule],
   controllers: [PostController],
   providers: [PostService, PostQueryRepository, PostRepository, UpdateLikeStatusForPostUseCase, PostCreateUseCase, PostsGetUseCase, PostGetByIdUseCase, PostsGetByBlogIdUseCase],
   exports: [PostService, PostRepository, PostsGetByBlogIdUseCase, PostCreateUseCase]
})
export class PostsModule {
}