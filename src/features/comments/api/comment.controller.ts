import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Inject, Param, Put, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CommentWithLikesOutputModel } from "./models/output/comment.output.model";
import { ResultStatus } from "../../../base/models/enums/enums";
import { CommentUpdateInputModel } from "./models/input/comment.input.models";
import { JwtAuthGuard } from "../../../infrastructure/guards/jwt-auth.guard";
import { CurrentUserId } from "../../../infrastructure/decorators/transform/current-user-id.param.decorator";
import { CommentUpdateCommand } from "../application/use-cases/update.comment.use-case";
import { CommentService } from "../application/comment.service";
import { UpdateLikeStatusForCommentCommand } from "../application/use-cases/update-like-status-for-comment.use-case";
import { CommentDeleteCommand } from "../application/use-cases/delete.comment.use-case";
import { InputLikeStatusModel } from "../../../base/models/input/input.models";
import { CommentQueryRepository } from "../infrastructure/comment.query.repository";


@Controller('comments')
export class CommentController {
   constructor(private commandBus: CommandBus,
      @Inject(CommentQueryRepository.name) private readonly commentQueryRepository: CommentQueryRepository,
      @Inject(CommentService.name) private readonly commentService: CommentService,
   ) {}

   @Get(':commentId')
   @HttpCode(200)
   async getCommentById(@Param('commentId') commentId: string, @CurrentUserId() userId: string): Promise<CommentWithLikesOutputModel | null> {
      console.log('COMMENT USERID', userId)
      // не приходит userId
      const res = await this.commentQueryRepository.getComments(userId, undefined, undefined, commentId)
      if (!res) throw new HttpException(`Post not found`, HttpStatus.NOT_FOUND)
      return res as CommentWithLikesOutputModel
   }

   @Put(':commentId')
   @UseGuards(JwtAuthGuard)
   @HttpCode(204)
   async updateComment(@Param('commentId') commentId: string, @Body() comment: CommentUpdateInputModel, @CurrentUserId() userId: string): Promise<void> {
      const checkOwner = await this.commentService.checkOwnerId(commentId, userId)
      if(checkOwner.status === ResultStatus.FORBIDDEN) throw new HttpException(`403`, HttpStatus.FORBIDDEN)
      const res = await this.commandBus.execute(new CommentUpdateCommand(commentId, comment.content))
      if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Comment not found`, HttpStatus.NOT_FOUND)
      if(res.status === ResultStatus.SUCCESS) return
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)   
   }

   @Put(':commentId/like-status')
   @UseGuards(JwtAuthGuard)
   @HttpCode(204)
   async updateLikeStatus(@Param('commentId') commentId: string,  @CurrentUserId() userId: string, @Body() LikeStatus: InputLikeStatusModel): Promise<void> {

      const res = await this.commandBus.execute(new UpdateLikeStatusForCommentCommand(commentId, LikeStatus.likeStatus, userId))
      if(res.status === ResultStatus.SUCCESS) return
      if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Comment not found`, HttpStatus.NOT_FOUND)
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   }

   @Delete(':commentId')
   @UseGuards(JwtAuthGuard)
   @HttpCode(204)
   async deleteComment(@Param('commentId') commentId: string, @CurrentUserId() userId: string): Promise<void> {

      const checkOwner = await this.commentService.checkOwnerId(commentId, userId)
      if(checkOwner.status === ResultStatus.FORBIDDEN) throw new HttpException(`403`, HttpStatus.FORBIDDEN)
      const res = await this.commandBus.execute(new CommentDeleteCommand(commentId))
      if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Comment not found`, HttpStatus.NOT_FOUND)
      return
   }
} 