import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LikeStatusEnum, ResultStatus } from "../../../../base/models/enums/enums";
import { LikeCommentRepository } from "../../infrastructure/like.comment.repository";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { LikeForComment } from "../../domain/like.for.comment.mongoose.entity";
import { CommentRepository } from "../../infrastructure/comment.repository";

export class UpdateLikeStatusForCommentCommand {
   constructor(public commentId: string,
      public likeStatus: LikeStatusEnum,
      public userId: string
   ) { }
}

@CommandHandler(UpdateLikeStatusForCommentCommand)
export class UpdateLikeStatusForCommentUseCase implements ICommandHandler<UpdateLikeStatusForCommentCommand> {
   constructor(
      private readonly likeCommentRepository: LikeCommentRepository,
      private readonly commentRepository: CommentRepository
   ) { }
   async execute(command: UpdateLikeStatusForCommentCommand): Promise<ResultObjectModel<boolean>> {
      try {
         const comment = await this.commentRepository.findCommentById(command.commentId)
         if(!comment) return {
            data: null,
            errorMessage: 'Comment not found',
            status: ResultStatus.NOT_FOUND
         }
         const like = await this.likeCommentRepository.findLikeByCommentIdAndUserId(command.commentId, command.userId)
         if ((like && like.likeStatus === command.likeStatus) || (!like && (command.likeStatus === LikeStatusEnum.None))) return {
            data: null,
            status: ResultStatus.SUCCESS
         }
         if (!like) {
            const likeData = {
               commentId: command.commentId,
               userId: command.userId,
               likeStatus: command.likeStatus
            }
            const newLike = LikeForComment.create(likeData)
            await this.likeCommentRepository.createLikeForComment(newLike)
            return {
               data: null,
               status: ResultStatus.SUCCESS
            }
         } else if (like && (command.likeStatus === LikeStatusEnum.None)) {
            await this.likeCommentRepository.deleteLikeById(command.commentId)
            return {
               data: null,
               status: ResultStatus.SUCCESS
            }
         }
         like.likeStatus = command.likeStatus
         await like.save()
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