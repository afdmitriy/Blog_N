import { Module, forwardRef } from "@nestjs/common";
import { BlogController } from "./api/blog.controller";
import { BlogService } from "./application/blog.service";
import { BlogQueryRepository } from "./infrastructure/blog.query.repository";
import { BlogRepository } from "./infrastructure/blog.repository";
import { BlogSchema } from "./domain/entities/blog.mongoose.entity";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsModule } from "../posts/posts.module";

@Module({
   imports: [MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }]),
   forwardRef(() => PostsModule)],
   controllers: [BlogController],
   providers: [BlogService, BlogQueryRepository, BlogRepository],
   exports: [BlogRepository]
})
export class BlogsModule {
}