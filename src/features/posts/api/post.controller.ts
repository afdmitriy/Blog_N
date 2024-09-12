import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Param, Post, Put, Query, UseGuards } from "@nestjs/common"
import { PostOutputWithLikesModel } from "./models/output/post.output.models"
import { CurrentUserId } from "../../../infrastructure/decorators/transform/current-user-id.param.decorator"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
// import { JwtAuthGuard } from "../../../infrastructure/guards/jwt-auth.guard"
// import { ResultStatus } from "../../../base/models/enums/enums"
// import { UpdateLikeStatusForPostCommand } from "../application/use-cases/update-like-status-for-post.use-case"
// import { CommentWithLikesOutputModel } from "../../comments/api/models/output/comment.output.model"
// import { CommentUpdateInputModel } from "../../comments/api/models/input/comment.input.models"
// import { CommentCreateCommand } from "../../comments/application/use-cases/create.comment.use-case"
// import { CommentsGetQuery } from "../../comments/application/use-cases/get.comments.use-case"
// import { PostGetByIdQuery } from "../application/use-cases/get.post.use-case"
// import { InputLikeStatusModel, QueryPaginationModel } from "../../../base/models/input/input.models"
import { PaginationWithItems } from "../../../base/models/pagination"

import { PostQueryRepository } from "../infrastructure/post.query.repository"
import { QueryPaginationPipe } from "../../../infrastructure/pipes/query.global.pipe"
import { QueryPaginationResult } from "../../../infrastructure/types/query-sort.type"

@Controller('posts')
export class PostController {
   constructor(
      @Inject(PostQueryRepository.name) private readonly postQueryRepository: PostQueryRepository,
      private commandBus: CommandBus,
      private readonly queryBus: QueryBus,
   ) { }

   @Get('')
   async getAllPosts(@Query(QueryPaginationPipe) queryParams: QueryPaginationResult, @CurrentUserId() userId: string): Promise<PaginationWithItems<PostOutputWithLikesModel> | PostOutputWithLikesModel | null> {
      return await this.postQueryRepository.getPosts(userId,  queryParams)
      // const res = await this.queryBus.execute(new PostsGetQuery(queryParams, userId))
      // if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Posts not found`, HttpStatus.NOT_FOUND)
      // if(res.status === ResultStatus.SUCCESS) return res.data
      // throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   }
   @Get(':postId')
   async getPostById(@Param('postId') postId: string, @CurrentUserId() userId: string): Promise<PaginationWithItems<PostOutputWithLikesModel> | PostOutputWithLikesModel | null> {
      const res = await this.postQueryRepository.getPosts(userId, undefined, undefined, postId)
      if (!res) throw new HttpException(`Post not found`, HttpStatus.NOT_FOUND)
      return res
      // const res = await this.queryBus.execute(new PostGetByIdQuery(postId, userId))
      // if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Post not found`, HttpStatus.NOT_FOUND)
      // if(res.status === ResultStatus.SUCCESS) return res.data
      // throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   }

   // @Put(':postId/like-status')
   // @UseGuards(JwtAuthGuard)
   // @HttpCode(204)
   // async updateLikeStatus(@Param('postId') postId: string, @CurrentUserId() userId: string, @Body() LikeStatus: InputLikeStatusModel): Promise<void> {

   //    const res = await this.commandBus.execute(new UpdateLikeStatusForPostCommand(postId, LikeStatus.likeStatus, userId))
   //    if (res.status === ResultStatus.SUCCESS) return
   //    if (res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Post or user not found`, HttpStatus.NOT_FOUND)
   //    throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   // }

   // @Get(':postId/comments')
   // @HttpCode(200)
   // async getCommentsByPostId(@Param('postId') postId: string, @Query() queryParams: QueryPaginationModel, @CurrentUserId() userId: string): Promise<PaginationWithItems<CommentWithLikesOutputModel>> {

   //    const res = await this.queryBus.execute(new CommentsGetQuery(postId, queryParams, userId))
   //    if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Comment not found`, HttpStatus.NOT_FOUND)
   //    if(res.status === ResultStatus.SUCCESS) return res.data
   //    throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)  
   // }

   // @Post(':postId/comments')
   // @UseGuards(JwtAuthGuard)
   // @HttpCode(201)
   // async createCommentByPostId(@Param('postId') postId: string, @CurrentUserId() userId: string, @Body() content: CommentUpdateInputModel) {
   //    const res = await this.commandBus.execute(new CommentCreateCommand(userId, postId, content.content))
   //    if (res.status === ResultStatus.SUCCESS) return res.data
   //    if (res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Post or user not found`, HttpStatus.NOT_FOUND)
   //    throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   // }
}  