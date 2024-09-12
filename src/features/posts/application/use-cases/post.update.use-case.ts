import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { Inject } from "@nestjs/common";
import { PostWithoutBlogInputModel } from "../../api/models/input/post.input";
import { PostRepository } from "../../infrastructure/post.repository";


export class PostUpdateCommand {
   constructor(
      public postId: string,
      public postData: PostWithoutBlogInputModel,
   ) { }
}

@CommandHandler(PostUpdateCommand)
export class PostUpdateUseCase implements ICommandHandler<PostUpdateCommand> {
   constructor(
      @Inject(PostRepository.name) private readonly postRepository: PostRepository,

   ) { }
   async execute(command: PostUpdateCommand): Promise<ResultObjectModel<null>> {
      try {
         const targetPost = await this.postRepository.getById(command.postId);

         if (!targetPost) return {
            data: null,
            errorMessage: 'Post not found',
            status: ResultStatus.NOT_FOUND
         }

         targetPost.updatePost(command.postData);

         await this.postRepository.save(targetPost);

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