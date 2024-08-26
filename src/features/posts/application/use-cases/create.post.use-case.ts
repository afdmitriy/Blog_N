import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostInputModel } from "../../api/models/input/post.input";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { BlogRepository } from "../../../blogs/infrastructure/blog.repository";
import { Inject } from "@nestjs/common";
import { PostRepository } from "../../infrastructure/post.repository";
import { Post_Orm } from "../../domain/post.typOrm.entity";


export class PostCreateCommand {
   constructor(
      public postData: PostInputModel
   ) { }
}

@CommandHandler(PostCreateCommand)
export class PostCreateUseCase implements ICommandHandler<PostCreateCommand> {
   constructor(
      @Inject(PostRepository.name) private readonly postRepository: PostRepository,
      @Inject(BlogRepository.name) private readonly blogRepository: BlogRepository,
   ) { }
   async execute(command: PostCreateCommand): Promise<ResultObjectModel<string>> {
      try {
         const blog = await this.blogRepository.getById(command.postData.blogId);
         if (!blog) return {
            data: null,
            errorMessage: 'Blog not found',
            status: ResultStatus.NOT_FOUND
         }
         const newPostData = {
            ...command.postData,
            blogName: blog.name
         }
         const newPost: Post_Orm = Post_Orm.createPostModel(newPostData)

         const post = await this.postRepository.save(newPost);

         return {
            data: post.id,
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