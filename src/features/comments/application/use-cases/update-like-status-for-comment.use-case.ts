import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LikeStatusEnum, ResultStatus } from "../../../../base/models/enums/enums";
import { LikeCommentRepository } from "../../infrastructure/like.comment.repository";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { CommentRepository } from "../../infrastructure/comment.repository";
import { LikeForComment_Orm } from "../../domain/like-for-comment.typeOrm.entity";
import { Inject } from "@nestjs/common";

export class UpdateLikeStatusForCommentCommand {
   constructor(public commentId: string,
      public likeStatus: LikeStatusEnum,
      public userId: string
   ) { }
}

@CommandHandler(UpdateLikeStatusForCommentCommand)
export class UpdateLikeStatusForCommentUseCase implements ICommandHandler<UpdateLikeStatusForCommentCommand> {
   constructor(
      @Inject(CommentRepository.name) private readonly commentRepository: CommentRepository,
      @Inject(LikeCommentRepository.name) private readonly likeCommentRepository: LikeCommentRepository,
   ) { }
   async execute(command: UpdateLikeStatusForCommentCommand): Promise<ResultObjectModel<boolean>> {
      try {
         const comment = await this.commentRepository.getById(command.commentId)
         if (!comment) return {
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
            const newLike = LikeForComment_Orm.createLikeModel(likeData)
            await this.likeCommentRepository.save(newLike)
            return {
               data: null,
               status: ResultStatus.SUCCESS
            }
         } else if (like && (command.likeStatus === LikeStatusEnum.None)) {
            await this.likeCommentRepository.deleteById(like.id)
            return {
               data: null,
               status: ResultStatus.SUCCESS
            }
         }
         like.updateLikeStatus(command.likeStatus)
         await this.likeCommentRepository.save(like)
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