import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { BlogInputModel } from "../../api/models/input/blog.input";
import { BlogRepository } from "../../infrastructure/blog.repository";
import { Inject } from "@nestjs/common";


export class BlogUpdateCommand {
   constructor(
      public blogId: string,
      public blogData: BlogInputModel,
   ) { }
}

@CommandHandler(BlogUpdateCommand)
export class BlogUpdateUseCase implements ICommandHandler<BlogUpdateCommand> {
   constructor(
      @Inject(BlogRepository.name) private readonly blogRepository: BlogRepository,

   ) { }
   async execute(command: BlogUpdateCommand): Promise<ResultObjectModel<null>> {
      try {
         const targetBlog = await this.blogRepository.getById(command.blogId);

         if (!targetBlog) return {
            data: null,
            errorMessage: 'Blog not found',
            status: ResultStatus.NOT_FOUND
         }

         targetBlog.updateBlog(command.blogData);

         await this.blogRepository.save(targetBlog);

         return {
            data: null,
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