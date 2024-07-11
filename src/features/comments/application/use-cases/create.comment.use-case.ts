import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentRepository } from "../../infrastructure/comment.repository";
import { UserRepository } from "../../../users/infrastructure/user.repository";
import { CommentWithLikesOutputModel } from "../../api/models/output/comment.output.model";
import { Comment } from "../../domain/comment.mongoose.entity";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { LikeStatusEnum, ResultStatus } from "../../../../base/models/enums/enums";
import { PostRepository } from "../../../posts/infrastructure/post.repository";

export class CommentCreateCommand {
   constructor(public userId: string,
      public postId: string,
      public content: string
   ) { }
}

@CommandHandler(CommentCreateCommand)
export class CommentCreateUseCase implements ICommandHandler<CommentCreateCommand> {
   constructor(
      protected commentRepository: CommentRepository,
      protected userRepository: UserRepository,
      private readonly postRepository: PostRepository
   ) { }
   async execute(command: CommentCreateCommand): Promise<ResultObjectModel<CommentWithLikesOutputModel>> {
      try {
         const post = await this.postRepository.getPostById(command.postId);
         if (!post) return {
            data: null,
            errorMessage: 'Post not found',
            status: ResultStatus.NOT_FOUND
         }
         const user = await this.userRepository.getUserById(command.userId);
         if (!user) return {
            data: null,
            errorMessage: 'User not found',
            status: ResultStatus.NOT_FOUND
         }
         const newComment = {
            content: command.content,
            userId: command.userId,
            postId: command.postId,
            userLogin: user.login
         }
         const comment = Comment.create(newComment)
         const createdComment = await this.commentRepository.createComment(comment)
         if (!createdComment) return {
            data: null,
            status: ResultStatus.SERVER_ERROR,
         }
         const commentDto = createdComment.toDto()
         
         const resComment = {
            ...commentDto,
            likesInfo: {
               likesCount: 0,
               dislikesCount: 0,
               myStatus: LikeStatusEnum.None
            }
         }

         return {
            data: resComment,
            status: ResultStatus.SUCCESS
         }

      } catch (error) {
         console.log(error)
         throw error
      }
   }
}