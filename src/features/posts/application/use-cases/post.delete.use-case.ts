import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { Inject } from "@nestjs/common";
import { PostRepository } from "../../infrastructure/post.repository";

export class PostDeleteCommand {
   constructor(
      public postId: string
   ) { }
}

@CommandHandler(PostDeleteCommand)
export class PostDeleteUseCase implements ICommandHandler<PostDeleteCommand> {
   constructor(
      @Inject(PostRepository.name) private readonly postRepository: PostRepository,

   ) { }
   async execute(command: PostDeleteCommand): Promise<ResultObjectModel<null>> {
      try {
         const post = await this.postRepository.getById(command.postId)
      if(!post) return {
         data: null,
         errorMessage: 'Post not found',
         status: ResultStatus.NOT_FOUND
      }
      
      const result = this.postRepository.deleteById(command.postId);
      if (!result) return {
			data: null,
			errorMessage: 'Error while delete post in DB',
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