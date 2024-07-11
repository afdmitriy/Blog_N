import { Injectable } from "@nestjs/common";
import { CommentRepository } from "../infrastructure/comment.repository";
import { ResultStatus } from "../../../base/models/enums/enums";
import { ResultObjectModel } from "../../../base/models/result.object.type";

@Injectable()
export class CommentService {
   constructor(private readonly commentRepository: CommentRepository) { }

   async checkOwnerId(commentId: string, userId: string): Promise<ResultObjectModel<boolean>>  {
      const comment = await this.commentRepository.findCommentById(commentId);
      if (!comment) return {
         data: null,
         errorMessage: '',
         status: ResultStatus.NOT_FOUND
      }
      if (comment.commentatorInfo.userId !== userId) return {
         data: null,
         errorMessage: 'Forbidden action',
         status: ResultStatus.FORBIDDEN
      }
      return {
         data: null,
         status: ResultStatus.SUCCESS
      }
   }
}