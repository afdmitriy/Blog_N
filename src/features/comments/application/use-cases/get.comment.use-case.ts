import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CommentQueryRepository } from "../../infrastructure/comment.query.repository";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { CommentWithLikesOutputModel } from "../../api/models/output/comment.output.model";
import { LikeService } from "../../../../infrastructure/modules/like/like.service";

export class CommentGetQuery {
   constructor(public commentId: string,
      public userId?: string,
   ) { }
}

@QueryHandler(CommentGetQuery)
export class CommentGetUseCase implements IQueryHandler<CommentGetQuery> {
   constructor(
      private readonly commentQueryRepository: CommentQueryRepository,
      private readonly likeService: LikeService
   ) { }
   async execute(query: CommentGetQuery): Promise<ResultObjectModel<CommentWithLikesOutputModel>> {
      try {
         const comment = await this.commentQueryRepository.getCommentById(query.commentId)
         if (!comment) return {
            data: null,
            errorMessage: 'Comment not found',
            status: ResultStatus.NOT_FOUND
         }
         const likesInfo = await this.likeService.makeLikesInfoForComment(query.commentId, query.userId)
         return {
            data: {
               ...comment,
               likesInfo: likesInfo
            },
            status: ResultStatus.SUCCESS
         }
      } catch (error) {
         console.log(error)
         return {data: null, status: ResultStatus.SERVER_ERROR}
      }
   }
}