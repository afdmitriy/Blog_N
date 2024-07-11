import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { LikeCommentDocument, LikeForComment } from "../domain/like.for.comment.mongoose.entity";
import { Model } from "mongoose";

@Injectable()
export class LikeCommentRepository {
   constructor(@InjectModel(LikeForComment.name) private likeCommentModel: Model<LikeCommentDocument>) { }

   async createLikeForComment(likeData: LikeForComment): Promise<boolean> {
      try {
         // const like = await this.likeCommentModel.create(likeData);
         const like = await new this.likeCommentModel(likeData).save();
         if (!like._id) {
            return false;
         }
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   async findLikeByCommentIdAndUserId(commentId: string, userId: string): Promise<LikeCommentDocument | null> {
      console.log(commentId, userId);
      try {
         const like = await this.likeCommentModel.findOne({ commentId: commentId, userId: userId });
         if (!like) {
            return null;
         }
         return like;
      } catch (error) {
         console.log(error);
         return null;
      }
   }

   async getCountOfLikesByCommentId(commentId: string): Promise<{
      likesCount: number;
      dislikesCount: number;
   } | null> {
      try {
         const likeCount = await this.likeCommentModel.countDocuments({ commentId: commentId, likeStatus: "Like" }).lean();

         const dislikeCount = await this.likeCommentModel.countDocuments({ commentId: commentId, likeStatus: "Dislike" }).lean();

         const likesCount = {
            likesCount: likeCount,
            dislikesCount: dislikeCount
         }
         return likesCount;
      } catch (error) {
         console.log(error);
         return null;
      }
   }

   async deleteLikeById(commentId: string): Promise<boolean> {
      const like = await this.likeCommentModel.deleteOne({ commentId: commentId });
      if (like.deletedCount === 0) {
         return false;
      }
      return true;
   }
}