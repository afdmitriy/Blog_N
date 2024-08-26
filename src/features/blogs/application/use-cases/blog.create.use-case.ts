import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { BlogInputModel } from "../../api/models/input/blog.input";
import { BlogRepository } from "../../infrastructure/blog.repository";
import { Inject } from "@nestjs/common";
import { Blog_Orm } from "../../domain/entities/blog.typeOrm.entity";


export class BlogCreateCommand {
   constructor(
      public blogData: BlogInputModel
   ) { }
}

@CommandHandler(BlogCreateCommand)
export class BlogCreateUseCase implements ICommandHandler<BlogCreateCommand> {
   constructor(
      @Inject(BlogRepository.name) private readonly blogRepository: BlogRepository,

   ) { }
   async execute(command: BlogCreateCommand): Promise<ResultObjectModel<string>> {
      try {
         const newBlog = Blog_Orm.createBlogModel(command.blogData);

         const res = await this.blogRepository.save(newBlog);
         if (!res) return {
            data: null,
            errorMessage: 'Error while create blog in DB',
            status: ResultStatus.SERVER_ERROR
         }
         return {
            data: newBlog.id,
            status: ResultStatus.SUCCESS
         }

      } catch (error) {
         console.log(error)
         return {
            data: null,
            status: ResultStatus.SERVER_ERROR
         }
      }
   }
}