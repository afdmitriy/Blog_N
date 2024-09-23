import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, Param, Post, Put, Query, UseGuards } from "@nestjs/common"
import { PostOutputWithLikesModel } from "./models/output/post.output.models"
import { CurrentUserId } from "../../../infrastructure/decorators/transform/current-user-id.param.decorator"
import { CommandBus } from "@nestjs/cqrs"
import { JwtAuthGuard } from "../../../infrastructure/guards/jwt-auth.guard"
import { ResultStatus } from "../../../base/models/enums/enums"
import { UpdateLikeStatusForPostCommand } from "../application/use-cases/update-like-status-for-post.use-case"
import { CommentWithLikesOutputModel } from "../../comments/api/models/output/comment.output.model"
import { CommentUpdateInputModel } from "../../comments/api/models/input/comment.input.models"
import { CommentCreateCommand } from "../../comments/application/use-cases/create.comment.use-case"
import { InputLikeStatusModel } from "../../../base/models/input/input.models"
import { PaginationWithItems } from "../../../base/models/pagination"
import { PostQueryRepository } from "../infrastructure/post.query.repository"
import { QueryPaginationPipe } from "../../../infrastructure/pipes/query.global.pipe"
import { QueryPaginationResult } from "../../../infrastructure/types/query-sort.type"
import { CommentQueryRepository } from "../../comments/infrastructure/comment.query.repository"
import { isUUID } from "class-validator"

@Controller('posts')
export class PostController {
   constructor(
      @Inject(PostQueryRepository.name) private readonly postQueryRepository: PostQueryRepository,
      @Inject(CommentQueryRepository.name) private readonly commentQueryRepository: CommentQueryRepository,
      private commandBus: CommandBus,
   ) { }

   @Get('')
   async getAllPosts(@Query(QueryPaginationPipe) queryParams: QueryPaginationResult, @CurrentUserId() userId: string): Promise<PaginationWithItems<PostOutputWithLikesModel> | PostOutputWithLikesModel | null> {
      return await this.postQueryRepository.getPosts(userId, queryParams)
   }
   @Get(':postId')
   async getPostById(@Param('postId') postId: string, @CurrentUserId() userId: string): Promise<PaginationWithItems<PostOutputWithLikesModel> | PostOutputWithLikesModel | null> {
      const res = await this.postQueryRepository.getPosts(userId, undefined, undefined, postId)
      if (!res) throw new HttpException(`Post not found`, HttpStatus.NOT_FOUND)
      return res
   }

   @Put(':postId/like-status')
   @UseGuards(JwtAuthGuard)
   @HttpCode(204)
   async updateLikeStatus(@Param('postId') postId: string, @CurrentUserId() userId: string, @Body() LikeStatus: InputLikeStatusModel): Promise<void> {
      const res = await this.commandBus.execute(new UpdateLikeStatusForPostCommand(postId, LikeStatus.likeStatus, userId))
      if (res.status === ResultStatus.SUCCESS) return
      if (res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Post or user not found`, HttpStatus.NOT_FOUND)
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   }

   @Get(':postId/comments')
   @HttpCode(200)
   async getCommentsByPostId(@Query(QueryPaginationPipe) queryParams: QueryPaginationResult, @Param('postId') postId: string, @CurrentUserId() userId: string): Promise<PaginationWithItems<CommentWithLikesOutputModel>> {
      if (!isUUID(postId)) {
         throw new BadRequestException('Wrong format UUID');
      }

      const post = await this.postQueryRepository.getPosts(userId, undefined, undefined, postId)
      if (!post) throw new HttpException(`Post not found`, HttpStatus.NOT_FOUND)
      const res = await this.commentQueryRepository.getComments(userId, queryParams, postId)
      return res as PaginationWithItems<CommentWithLikesOutputModel>
   }

   @Post(':postId/comments')
   @UseGuards(JwtAuthGuard)
   @HttpCode(201)
   async createCommentByPostId(@Param('postId') postId: string, @CurrentUserId() userId: string, @Body() content: CommentUpdateInputModel) {
      if (!isUUID(postId)) {
         throw new BadRequestException('Wrong format UUID');
      }
      const res = await this.commandBus.execute(new CommentCreateCommand(userId, postId, content.content))
      if (res.status === ResultStatus.SUCCESS) {
         return await this.commentQueryRepository.getComments(userId, undefined, undefined, res.data)
      }
      if (res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Post or user not found`, HttpStatus.NOT_FOUND)
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   }
}  