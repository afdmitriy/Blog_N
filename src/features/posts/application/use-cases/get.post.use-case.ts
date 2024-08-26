import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { PostOutputWithLikesModel } from "../../api/models/output/post.output.models";
import { PostRepository } from "../../infrastructure/post.mongoose.repository";
import { LikeService } from "../../../../infrastructure/modules/like/like.service";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { Post } from "../../domain/post.mongoose.entity";

export class PostGetByIdQuery {
   constructor(public postId: string,
      public userId?: string
   ) { }
}

@QueryHandler(PostGetByIdQuery)
export class PostGetByIdUseCase implements IQueryHandler<PostGetByIdQuery> {
   constructor(
      protected postRepository: PostRepository,
      private readonly likeService: LikeService

   ) { }
   async execute(query: PostGetByIdQuery): Promise<ResultObjectModel<PostOutputWithLikesModel>> {
      const post = await this.postRepository.getPostById(query.postId);
      if (!post) {
         return {
            data: null,
            errorMessage: 'Post not found',
            status: ResultStatus.NOT_FOUND
         };
      }
      const postDto = Post.toDto(post)

      const likesInfo = await this.likeService.makeLikesInfoForPost(query.postId, query.userId);
      return {
         data: {
            ...postDto,
            extendedLikesInfo: likesInfo
         },
         status: ResultStatus.SUCCESS
      };
   }
}