import { Module, forwardRef } from "@nestjs/common";
import { PostController } from "./api/post.controller";
import { PostService } from "./application/post.service";
import { PostQueryRepository } from "./infrastructure/post.query.repository";
import { PostRepository } from "./infrastructure/post.repository";
import { PostSchema } from "./domain/post.mongoose.entity";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogsModule } from "../blogs/blogs.module";
import { LikePostsModule } from "./like.post.module";

@Module({
   imports: [MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
   forwardRef(() => BlogsModule),
   LikePostsModule],
   controllers: [PostController],
   providers: [PostService, PostQueryRepository, PostRepository],
   exports: [PostService]
})
export class PostsModule {
}