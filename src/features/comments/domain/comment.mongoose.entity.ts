// import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
// import { HydratedDocument, Types } from "mongoose";
// import { CommentCreateModel } from "../api/models/input/comment.input.models";
// import { CommentOutputModel } from "../api/models/output/comment.output.model";

// @Schema({_id: false, versionKey: false})
// export class CommentatorInfo {

//    @Prop({ required: true })
//    userId: string;

//    @Prop({ required: true })
//    userLogin: string;
// }
// export const CommentatorInfoSchema = SchemaFactory.createForClass(CommentatorInfo); 

// @Schema()
// export class Comment {

// 	_id: Types.ObjectId;
   
// 	@Prop({ required: true })
// 	postId: string;

// 	@Prop({ required: true })
// 	content: string;

// 	@Prop({ required: true })
// 	createdAt: string; 

// 	@Prop({ required: false, type: CommentatorInfoSchema })
//    commentatorInfo: CommentatorInfo;

// 	static create(commentInput: CommentCreateModel) {
// 		const comment = new this()
// 		comment.content = commentInput.content;
// 		comment.postId = commentInput.postId
//       comment.createdAt = new Date().toISOString();
// 		comment.commentatorInfo = {
// 			userId: commentInput.userId,
// 			userLogin: commentInput.userLogin
// 		}
// 		return comment
//    }

// 	toDto(): CommentOutputModel {
// 		return {
// 			id: this._id.toString(),
// 			content: this.content,
// 			createdAt: this.createdAt,
// 			commentatorInfo: {
// 				userId: this.commentatorInfo.userId,
// 				userLogin: this.commentatorInfo.userLogin
// 			}
// 		}
// 	}

// 	update(content: string): void {
// 		this.content = content;
// 	}
// }
// export type CommentDocument = HydratedDocument<Comment>;
// export const CommentSchema = SchemaFactory.createForClass(Comment); 
// CommentSchema.loadClass(Comment);