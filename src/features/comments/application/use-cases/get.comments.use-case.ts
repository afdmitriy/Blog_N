// import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
// import { CommentQueryRepository } from "../../infrastructure/comment.query.mongoose.repository";
// import { ResultStatus } from "../../../../base/models/enums/enums";
// import { ResultObjectModel } from "../../../../base/models/result.object.type";
// import { CommentWithLikesOutputModel } from "../../api/models/output/comment.output.model";
// import { LikeService } from "../../../../infrastructure/modules/like/like.service";
// import { QueryPaginationModel, QuerySortModel } from "../../../../base/models/input/input.models";
// import { PostRepository } from "../../../posts/infrastructure/post.repository";
// import { PaginationWithItems } from "../../../../base/models/pagination";

// export class CommentsGetQuery {
//    constructor(public postId: string,
//       public sortData: QueryPaginationModel,
//       public userId?: string,
//    ) { }
// }

// @QueryHandler(CommentsGetQuery)
// export class CommentsGetUseCase implements IQueryHandler<CommentsGetQuery> {
//    constructor(
//       private readonly commentQueryRepository: CommentQueryRepository,
//       private readonly likeService: LikeService,
//       private readonly postRepository: PostRepository
//    ) { }
//    async execute(query: CommentsGetQuery): Promise<ResultObjectModel<PaginationWithItems<CommentWithLikesOutputModel>>> {
//       try {
//          const post = await this.postRepository.getPostById(query.postId)
//          if(!post) return {
//             data: null,
//             errorMessage: 'Post not found',
//             status: ResultStatus.NOT_FOUND
//          }

//          const queryParams: QuerySortModel = {
//             sortBy: query.sortData.sortBy ?? 'createdAt',
//             sortDirection: query.sortData.sortDirection ?? 'desc',
//             pageNumber: query.sortData.pageNumber ? +query.sortData.pageNumber : 1,
//             pageSize: query.sortData.pageSize ? +query.sortData.pageSize : 10,
//          };
//          const comments = await this.commentQueryRepository.getCommentsByPostId(query.postId, queryParams)
//          if (!comments) return {
//             data: null,
//             errorMessage: 'Comments not found',
//             status: ResultStatus.NOT_FOUND
//          }
         
//          const commentsWithLikes = await this.likeService.commentsAddLikesInfoForQuery(comments, query.userId)
//          return {
//             data: commentsWithLikes,
//             status: ResultStatus.SUCCESS
//          }
//       } catch (error) {
//          console.log(error)
//          return {data: null, status: ResultStatus.SERVER_ERROR}
//       }
//    }
// }