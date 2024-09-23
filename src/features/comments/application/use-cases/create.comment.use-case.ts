import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentRepository } from "../../infrastructure/comment.repository";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { UserRepository } from "../../../users/infrastructure/user.typeOrm.repository";
import { PostRepository } from "../../../posts/infrastructure/post.repository";
import { Comment_Orm } from "../../domain/comment.typeOrm.entity";
import { Inject } from "@nestjs/common";


export class CommentCreateCommand {
   constructor(public userId: string,
      public postId: string,
      public content: string
   ) { }
}

@CommandHandler(CommentCreateCommand)
export class CommentCreateUseCase implements ICommandHandler<CommentCreateCommand> {
   constructor(
      @Inject(CommentRepository.name) private readonly commentRepository: CommentRepository,
      @Inject(UserRepository.name) private readonly userRepository: UserRepository,
      @Inject(PostRepository.name) private readonly postRepository: PostRepository,
   ) { }
   async execute(command: CommentCreateCommand): Promise<ResultObjectModel<string>> {
      try {
         const post = await this.postRepository.getById(command.postId);
         if (!post) return {
            data: null,
            errorMessage: 'Post not found',
            status: ResultStatus.NOT_FOUND
         }
         const user = await this.userRepository.getById(command.userId);
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
         const comment = Comment_Orm.createCommentModel(newComment)
         const createdComment = await this.commentRepository.save(comment)
         if (!createdComment) return {
            data: null,
            status: ResultStatus.SERVER_ERROR,
         }

         return {
            data: createdComment.id,
            status: ResultStatus.SUCCESS
         }

      } catch (error) {
         console.log(error)
         throw error
      }
   }
}