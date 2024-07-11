import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Post, Put, Query, UseGuards } from "@nestjs/common"
import { PostService } from "../application/post.service"
import { PostOutputModel, PostOutputWithLikesModel } from "./models/output/post.output.models"
import { PostInputModel } from "./models/input/post.input"
import { JwtAuthGuard } from "../../../infrastructure/guards/jwt-auth.guard"
import { CurrentUserId } from "../../../infrastructure/decorators/transform/current-user-id.param.decorator"
import { ResultStatus } from "../../../base/models/enums/enums"
import { CommandBus, QueryBus } from "@nestjs/cqrs"
import { UpdateLikeStatusForPostCommand } from "../application/use-cases/update-like-status-for-post.use-case"
import { BasicAuthGuard } from "../../../infrastructure/guards/auth-basic.guard"
import { CommentWithLikesOutputModel } from "../../comments/api/models/output/comment.output.model"
import { CommentUpdateInputModel } from "../../comments/api/models/input/comment.input.models"
import { CommentCreateCommand } from "../../comments/application/use-cases/create.comment.use-case"
import { CommentsGetQuery } from "../../comments/application/use-cases/get.comments.use-case"
import { PostsGetQuery } from "../application/use-cases/get.posts.use-case"
import { PostGetByIdQuery } from "../application/use-cases/get.post.use-case"
import { PostCreateCommand } from "../application/use-cases/create.post.use-case"
import { InputLikeStatusModel, QueryPaginationModel } from "../../../base/models/input/input.models"
import { PaginationWithItems } from "../../../base/models/pagination"
import mongoose from "mongoose"

@Controller('posts')
export class PostController {
   constructor(protected readonly postService: PostService,
      private commandBus: CommandBus,
      private readonly queryBus: QueryBus,
   ) { }

   @Get('')
   async getAllPosts(@Query() queryParams: QueryPaginationModel, @CurrentUserId() userId: string): Promise<false | PaginationWithItems<PostOutputModel>> {
      const res = await this.queryBus.execute(new PostsGetQuery(queryParams, userId))
      if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Posts not found`, HttpStatus.NOT_FOUND)
      if(res.status === ResultStatus.SUCCESS) return res.data
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   }
   @Get(':postId')
   async getPostById(@Param('postId') postId: string, @CurrentUserId() userId: string): Promise<PostOutputWithLikesModel> {
      if (!mongoose.Types.ObjectId.isValid(postId)) throw new HttpException(`Post do not exist`, HttpStatus.NOT_FOUND);
      const res = await this.queryBus.execute(new PostGetByIdQuery(postId, userId))
      if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Post not found`, HttpStatus.NOT_FOUND)
      if(res.status === ResultStatus.SUCCESS) return res.data
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   }

   @Post('')
   @UseGuards(BasicAuthGuard)
   async createPost(@Body() inputPost: PostInputModel): Promise<PostOutputWithLikesModel> {
      const res = await this.commandBus.execute(new PostCreateCommand(inputPost))
      if (res.status === ResultStatus.SUCCESS) return res.data
      if (res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Blog`, HttpStatus.NOT_FOUND)
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   }


   @Put(':postId')
   @UseGuards(BasicAuthGuard)
   @HttpCode(204)
   async updatePost(@Param('postId') postId: string,
      @Body() postData: PostInputModel): Promise<void> {
      if (!mongoose.Types.ObjectId.isValid(postId)) throw new HttpException(`Post do not exist`, HttpStatus.NOT_FOUND);
      const res = await this.postService.updatePost(postId, postData)
      if (!res) throw new NotFoundException('Post Not Found');
      return;

   }

   @Delete(':postId')
   @UseGuards(BasicAuthGuard)
   @HttpCode(204)
   async deletePost(@Param('postId') postId: string) {
      if (!mongoose.Types.ObjectId.isValid(postId)) throw new HttpException(`Post do not exist`, HttpStatus.NOT_FOUND);
      const delteResult = await this.postService.deletePost(postId);
      if (!delteResult) throw new NotFoundException('Post Not Found');
      return;
   }

   @Put(':postId/like-status')
   @UseGuards(JwtAuthGuard)
   @HttpCode(204)
   async updateLikeStatus(@Param('postId') postId: string, @CurrentUserId() userId: string, @Body() LikeStatus: InputLikeStatusModel): Promise<void> {
      if (!mongoose.Types.ObjectId.isValid(postId)) throw new HttpException(`Post do not exist`, HttpStatus.NOT_FOUND);
      const res = await this.commandBus.execute(new UpdateLikeStatusForPostCommand(postId, LikeStatus.likeStatus, userId))
      if (res.status === ResultStatus.SUCCESS) return
      if (res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Post or user not found`, HttpStatus.NOT_FOUND)
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   }

   @Get(':postId/comments')
   @HttpCode(200)
   async getCommentsByPostId(@Param('postId') postId: string, @Query() queryParams: QueryPaginationModel, @CurrentUserId() userId: string): Promise<PaginationWithItems<CommentWithLikesOutputModel>> {
      if (!mongoose.Types.ObjectId.isValid(postId)) throw new HttpException(`Post do not exist`, HttpStatus.NOT_FOUND);
      const res = await this.queryBus.execute(new CommentsGetQuery(postId, queryParams, userId))
      if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Comment not found`, HttpStatus.NOT_FOUND)
      if(res.status === ResultStatus.SUCCESS) return res.data
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)  
   }

   @Post(':postId/comments')
   @UseGuards(JwtAuthGuard)
   @HttpCode(201)
   async createCommentByPostId(@Param('postId') postId: string, @CurrentUserId() userId: string, @Body() content: CommentUpdateInputModel) {
      if (!mongoose.Types.ObjectId.isValid(postId)) throw new HttpException(`Post do not exist`, HttpStatus.NOT_FOUND);
      const res = await this.commandBus.execute(new CommentCreateCommand(userId, postId, content.content))
      if (res.status === ResultStatus.SUCCESS) return res.data
      if (res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Post or user not found`, HttpStatus.NOT_FOUND)
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   }
}  