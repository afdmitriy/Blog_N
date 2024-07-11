import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Put, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CommentWithLikesOutputModel } from "./models/output/comment.output.model";
import { CommentGetQuery } from "../application/use-cases/get.comment.use-case";
import { ResultStatus } from "../../../base/models/enums/enums";
import { CommentUpdateInputModel } from "./models/input/comment.input.models";
import { JwtAuthGuard } from "../../../infrastructure/guards/jwt-auth.guard";
import { CurrentUserId } from "../../../infrastructure/decorators/transform/current-user-id.param.decorator";
import { CommentUpdateCommand } from "../application/use-cases/update.comment.use-case";
import { CommentService } from "../application/comment.service";
import { UpdateLikeStatusForCommentCommand } from "../application/use-cases/update-like-status-for-comment.use-case";
import { CommentDeleteCommand } from "../application/use-cases/delete.comment.use-case";
import { InputLikeStatusModel } from "../../../base/models/input/input.models";
import mongoose from "mongoose";

@Controller('comments')
export class CommentController {
   constructor(private commandBus: CommandBus,
      private readonly queryBus: QueryBus,
      private readonly commentService: CommentService
   ) {}

   @Get(':commentId')
   @HttpCode(200)
   async getCommentById(@Param('commentId') commentId: string, @CurrentUserId() userId: string): Promise<CommentWithLikesOutputModel> {
      if (!mongoose.Types.ObjectId.isValid(commentId)) throw new HttpException(`Comment do not exist`, HttpStatus.NOT_FOUND);
      const res = await this.queryBus.execute(new CommentGetQuery(commentId, userId))
      if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Comment not found`, HttpStatus.NOT_FOUND)
      if(res.status === ResultStatus.SUCCESS) return res.data
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)  
   }

   @Put(':commentId')
   @UseGuards(JwtAuthGuard)
   @HttpCode(204)
   async updateComment(@Param('commentId') commentId: string, @Body() comment: CommentUpdateInputModel, @CurrentUserId() userId: string): Promise<void> {
      
      if (!mongoose.Types.ObjectId.isValid(commentId)) throw new HttpException(`Comment do not exist`, HttpStatus.NOT_FOUND);
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
      if (!mongoose.Types.ObjectId.isValid(commentId)) throw new HttpException(`Comment do not exist`, HttpStatus.NOT_FOUND);
      const res = await this.commandBus.execute(new UpdateLikeStatusForCommentCommand(commentId, LikeStatus.likeStatus, userId))
      if(res.status === ResultStatus.SUCCESS) return
      if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Comment not found`, HttpStatus.NOT_FOUND)
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   }

   @Delete(':commentId')
   @UseGuards(JwtAuthGuard)
   @HttpCode(204)
   async deleteComment(@Param('commentId') commentId: string, @CurrentUserId() userId: string): Promise<void> {
      if (!mongoose.Types.ObjectId.isValid(commentId)) throw new HttpException(`Comment do not exist`, HttpStatus.NOT_FOUND);
      const checkOwner = await this.commentService.checkOwnerId(commentId, userId)
      if(checkOwner.status === ResultStatus.FORBIDDEN) throw new HttpException(`403`, HttpStatus.FORBIDDEN)
      const res = await this.commandBus.execute(new CommentDeleteCommand(commentId))
      if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Comment not found`, HttpStatus.NOT_FOUND)
      return
   }
} 