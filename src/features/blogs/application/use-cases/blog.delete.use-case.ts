import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { BlogRepository } from "../../infrastructure/blog.repository";
import { Inject } from "@nestjs/common";

export class BlogDeleteCommand {
   constructor(
      public blogId: string
   ) { }
}

@CommandHandler(BlogDeleteCommand)
export class BlogDeleteUseCase implements ICommandHandler<BlogDeleteCommand> {
   constructor(
      @Inject(BlogRepository.name) private readonly blogRepository: BlogRepository,

   ) { }
   async execute(command: BlogDeleteCommand): Promise<ResultObjectModel<string>> {
      try {
         const blog = await this.blogRepository.getById(command.blogId)
      if(!blog) return {
         data: null,
         errorMessage: 'Blog not found',
         status: ResultStatus.NOT_FOUND
      }
      
      const result = this.blogRepository.deleteById(command.blogId);
      if (!result) return {
			data: null,
			errorMessage: 'Error while delete blog in DB',
			status: ResultStatus.SERVER_ERROR,
		}
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