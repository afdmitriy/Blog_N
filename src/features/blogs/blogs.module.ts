import { Module, forwardRef } from "@nestjs/common";
import { BlogController } from "./api/blog.controller";
import { BlogService } from "./application/blog.service";
import { BlogQueryRepository } from "./infrastructure/blog.query.repository";
import { BlogRepository } from "./infrastructure/blog.repository";
import { BlogSchema } from "./domain/entities/blog.mongoose.entity";
import { MongooseModule } from "@nestjs/mongoose";
import { PostsModule } from "../posts/posts.module";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
   imports: [MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }]),
   forwardRef(() => PostsModule),
   CqrsModule],
   controllers: [BlogController],
   providers: [BlogService, BlogQueryRepository, BlogRepository],
   exports: [BlogRepository, BlogQueryRepository]
})
export class BlogsModule {
}