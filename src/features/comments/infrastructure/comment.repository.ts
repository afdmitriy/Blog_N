import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Comment, CommentDocument } from "../domain/comment.mongoose.entity";


@Injectable()
export class CommentRepository {
   constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) { }
   async createComment(
      commentData: Comment
   ): Promise<CommentDocument | null | false> {
      try {
         const res = await new this.commentModel(commentData).save()
         // console.log(res, "res")
         // const createdComment = await this.commentModel.create(commentData);
         // console.log(createdComment, "createdComment")
         // await createdComment.save()
         return res;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   async findCommentById(id: string): Promise<CommentDocument | null | false> {
      console.log(id, "COMMENT ID FOR FINDING")
      try {
         const comment = await this.commentModel.findOne({
            _id: id,
         })
         if (!comment) {
            return null;
         }
         return comment;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   async deleteCommentById(id: string): Promise<boolean> {
      try {
         const res = await this.commentModel.deleteOne({
            _id: id,
         });
         return !!res.deletedCount;
      } catch (error) {
         console.log(error);
         return false;
      }
   }
   
   async saveComment(comment: CommentDocument): Promise<void> {
		await comment.save();
	}

}