import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { PostOutputWithLikesModel } from "../../api/models/output/post.output.models";
import { LikeService } from "../../../../infrastructure/modules/like/like.service";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { PostQueryRepository } from "../../infrastructure/post.mongoose.query.repository";
import { PaginationWithItems } from "../../../../base/models/pagination";
import { QueryPaginationModel, QuerySortModel } from "../../../../base/models/input/input.models";

export class PostsGetQuery {
   constructor(public sortData: QueryPaginationModel,
      public userId?: string
   ) { }
}

@QueryHandler(PostsGetQuery)
export class PostsGetUseCase implements IQueryHandler<PostsGetQuery> {
   constructor(
      protected postQueryRepository: PostQueryRepository,
      private readonly likeService: LikeService

   ) { }
   async execute(query: PostsGetQuery): Promise<ResultObjectModel<PaginationWithItems<PostOutputWithLikesModel>>> {
      const queryParams: QuerySortModel = {
         sortBy: query.sortData.sortBy ?? 'createdAt',
         sortDirection: query.sortData.sortDirection ?? 'desc',
         pageNumber: query.sortData.pageNumber ? +query.sortData.pageNumber : 1,
         pageSize: query.sortData.pageSize ? +query.sortData.pageSize : 10,
      };

      const posts = await this.postQueryRepository.getAllPosts(queryParams)
      if(!posts) return{
         data: null,
         errorMessage: 'Posts not found',
         status: ResultStatus.NOT_FOUND
      }
      const postsWithLikes = await this.likeService.postsAddLikesInfoForQuery(posts, query.userId);
      return {
         data: postsWithLikes,
         status: ResultStatus.SUCCESS
      };
   }
}