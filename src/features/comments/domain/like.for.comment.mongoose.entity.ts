import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { LikeStatusEnum } from "../../../base/models/enums/enums";
import { LikeForCommentCreateModel } from "../api/models/input/like.comment.input.model";

@Schema()
export class LikeForComment {
	_id: Types.ObjectId;

   @Prop({ required: true })
	likeStatus: LikeStatusEnum;

   @Prop({ required: true })
	userId: string;

	@Prop({ required: true })
	commentId: string;

   @Prop({ required: true})
	createdAt: string; 

   static create(likeForComment: LikeForCommentCreateModel) {
      const like = new LikeForComment()
      like.likeStatus = likeForComment.likeStatus;
      like.userId = likeForComment.userId;
      like.commentId = likeForComment.commentId;
      like.createdAt = new Date().toISOString()
      return like
   }

   toDto() {
      return {
         likeStatus: this.likeStatus,
         userId: this.userId,
         commentId: this.commentId,
      }
   }

   updateLikeStatus(likeStatus: LikeStatusEnum) {
      this.likeStatus = likeStatus
   }
}

export type LikeCommentDocument = HydratedDocument<LikeForComment>;
export const LikeCommentSchema = SchemaFactory.createForClass(LikeForComment); 
LikeCommentSchema.loadClass(LikeForComment);