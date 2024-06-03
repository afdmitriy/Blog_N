import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { LikeStatusEnum } from "src/base/models/enums/enums";

// если лайк снят, то его лучше удалить или изменить статус на none?


@Schema()
export class LikeForPost {
	_id: Types.ObjectId;

   @Prop({ required: true })
	likeStatus: LikeStatusEnum;

   @Prop({ required: true })
	userId: string;

	@Prop({ required: true })
	postId: string;

   @Prop({ required: true, default: ()=> new Date() })
	createdAt: Date; 

   constructor(likeForPost: LikeForPost) {
      this.likeStatus = likeForPost.likeStatus;
      this.userId = likeForPost.userId;
      this.postId = likeForPost.postId;
   }

   updateLikeStatus(likeStatus: LikeStatusEnum) {
      this.likeStatus = likeStatus
   }
}

export type LikePostDocument = HydratedDocument<LikeForPost>;
export const LikePostSchema = SchemaFactory.createForClass(LikeForPost); 