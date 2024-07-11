import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PostInputModel } from "../../api/models/input/post.input";
import { BlogRepository } from "../../../blogs/infrastructure/blog.repository";
import { PostRepository } from "../../infrastructure/post.repository";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { PostOutputWithLikesModel } from "../../api/models/output/post.output.models";
import { LikeStatusEnum, ResultStatus } from "../../../../base/models/enums/enums";
import { Post } from "../../domain/post.mongoose.entity";

export class PostCreateCommand {
   constructor(
      public postData: PostInputModel
   ) { }
}

@CommandHandler(PostCreateCommand)
export class PostCreateUseCase implements ICommandHandler<PostCreateCommand> {
   constructor(
      protected postRepository: PostRepository,
      private readonly blogRepository: BlogRepository

   ) { }
   async execute(command: PostCreateCommand): Promise<ResultObjectModel<PostOutputWithLikesModel>> {
      try {
         const blog = await this.blogRepository.getBlogById(command.postData.blogId);
         if (!blog) return {
            data: null,
            errorMessage: 'Blog not found',
            status: ResultStatus.NOT_FOUND
         }
         const newPostData = {
            ...command.postData,
            blogName: blog.name
         }
         const newPost: Post = new Post(newPostData)

         const post = await this.postRepository.createPost(newPost);
         const addedPost = Post.toDto(post)
         return {
            data: {
               ...addedPost,
               extendedLikesInfo: {
                  likesCount: 0,
                  dislikesCount: 0,
                  myStatus: LikeStatusEnum.None,
                  newestLikes: []
               }
            },
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