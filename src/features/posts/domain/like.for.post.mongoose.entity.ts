import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { LikeStatusEnum } from "../../../base/models/enums/enums";
import { LikeForPostCreateModel } from "../api/models/input/like.post.input.model";


@Schema()
export class LikeForPost {
	_id: Types.ObjectId;

   @Prop({ required: true })
	likeStatus: LikeStatusEnum;

   @Prop({ required: true })
	userId: string;

	@Prop({ required: true })
	postId: string;

   @Prop({ required: true})
	createdAt: string; 

   static create(likeForPost: LikeForPostCreateModel) {
      const likeStatus = new LikeForPost()
      likeStatus.likeStatus = likeForPost.likeStatus;
      likeStatus.userId = likeForPost.userId;
      likeStatus.postId = likeForPost.postId;
      likeStatus.createdAt = new Date().toISOString()
      return likeStatus
   }

   toDto() {
      return {
         likeStatus: this.likeStatus,
         userId: this.userId,
         postId: this.postId,
         addedAt: this.createdAt
      }
   }

   updateLikeStatus(likeStatus: LikeStatusEnum) {
      this.likeStatus = likeStatus
   }
}

export type LikePostDocument = HydratedDocument<LikeForPost>;
export const LikePostSchema = SchemaFactory.createForClass(LikeForPost); 
LikePostSchema.loadClass(LikeForPost);