import { Module, forwardRef } from "@nestjs/common";
import { BlogSuperAdminController } from "./api/blog.sa.controller";
import { PostsModule } from "../posts/posts.module";
import { CqrsModule } from "@nestjs/cqrs";
import { BlogController } from "./api/blog.controller";
import { BlogRepository } from "./infrastructure/blog.repository";
import { BlogQueryRepository } from "./infrastructure/blog.query.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Blog_Orm } from "./domain/entities/blog.typeOrm.entity";
import { BlogUpdateUseCase } from "./application/use-cases/blog.update.use-case";
import { BlogCreateUseCase } from "./application/use-cases/blog.create.use-case";
import { BlogDeleteUseCase } from "./application/use-cases/blog.delete.use-case";

@Module({
   imports: [
      // MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }]),
      TypeOrmModule.forFeature([Blog_Orm]),
      forwardRef(() => PostsModule),
      CqrsModule],
   controllers: [BlogSuperAdminController, BlogController],
   providers: [
      // BlogService,
      {
         provide: BlogRepository.name,
         useClass: BlogRepository
      },
      {
         provide: BlogQueryRepository.name,
         useClass: BlogQueryRepository
      },
      BlogUpdateUseCase, BlogCreateUseCase, BlogDeleteUseCase
   ],
   exports: [BlogRepository.name, BlogQueryRepository.name]
})
export class BlogsModule {
}