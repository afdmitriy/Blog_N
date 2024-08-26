import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { PostOutputWithLikesModel } from "../../api/models/output/post.output.models";
import { LikeService } from "../../../../infrastructure/modules/like/like.service";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { PostQueryRepository } from "../../infrastructure/post.mongoose.query.repository";
import { PaginationWithItems } from "../../../../base/models/pagination";
import { QueryPaginationModel, QuerySortModel } from "../../../../base/models/input/input.models";
import { BlogQueryRepository } from "../../../blogs/infrastructure/blog.mongoose.query.repository";

export class PostsGetByBlogIdQuery {
   constructor(public sortData: QueryPaginationModel,
      public blogId: string,
      public userId?: string
   ) { }
}

@QueryHandler(PostsGetByBlogIdQuery)
export class PostsGetByBlogIdUseCase implements IQueryHandler<PostsGetByBlogIdQuery> {
   constructor(
      protected postQueryRepository: PostQueryRepository,
      private readonly likeService: LikeService,
      private readonly blogQueryRepository: BlogQueryRepository

   ) { }
   async execute(query: PostsGetByBlogIdQuery): Promise<ResultObjectModel<PaginationWithItems<PostOutputWithLikesModel>>> {
      const queryParams: QuerySortModel = {
         sortBy: query.sortData.sortBy ?? 'createdAt',
         sortDirection: query.sortData.sortDirection ?? 'desc',
         pageNumber: query.sortData.pageNumber ? +query.sortData.pageNumber : 1,
         pageSize: query.sortData.pageSize ? +query.sortData.pageSize : 10,
      };
      const blog = await this.blogQueryRepository.getBlogById(query.blogId)
      if(!blog) return{
         data: null,
         errorMessage: 'Blog not found',
         status: ResultStatus.NOT_FOUND
      }
      const posts = await this.postQueryRepository.findPostsByBlogIdWithQuery(query.blogId, queryParams)
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