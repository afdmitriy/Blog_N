import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { LikeForPost, LikePostDocument } from "../domain/like.for.post.mongoose.entity";
import { Model } from "mongoose";
import { LikeStatusEnum } from "../../../base/models/enums/enums";



@Injectable()
export class LikePostRepository {
   constructor(@InjectModel(LikeForPost.name) private likePostModel: Model<LikePostDocument>) { }
   async createLikeForPost(likeData: LikeForPost): Promise<boolean> {
      try {
         // const like = await this.likePostModel.create(likeData);
         // почему то create не работает здесь 
         const like = await new this.likePostModel(likeData).save();

         if (!like._id) {
            return false;
         }
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   async findLikeByPostIdAndUserId(postId: string, userId: any): Promise<LikePostDocument | null> {

      try {
         const like = await this.likePostModel.findOne({ postId, userId });
         if (!like) {
            return null;
         }
         console.log(like)
         return like;
      } catch (error) {
         console.log(error);
         return null;
      }
   }

   async getCountOfLikesByPostId(postId: string): Promise<{
      likesCount: number;
      dislikesCount: number;
   } | null> {
      try {
         const likeCount = await this.likePostModel.countDocuments({ postId, likeStatus: "Like" }).lean();

         const dislikeCount = await this.likePostModel.countDocuments({ postId, likeStatus: "Dislike" }).lean();

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

   async updateLikeStatus(id: string, likeStatus: LikeStatusEnum): Promise<boolean> {
      try {
         const res = await this.likePostModel.updateOne({ _id: id }, { $set: { likeStatus: likeStatus } });
         return !!res.modifiedCount;

      } catch (error) {
         console.log(error);
         return false;
      }

   }

   async findThreeNewestLikesByPostId(postId: string) {
      try {
         const res = await this.likePostModel.find({ postId: postId, likeStatus: LikeStatusEnum.Like }).sort({ createdAt: -1 }).limit(3);
         if (!res || res.length === 0) return []

         return res.map(like => {
            const likeDto = like.toDto()
            return likeDto
         })
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   async deleteLikeById(postId: string): Promise<boolean> {
      const like = await this.likePostModel.deleteOne({ postId: postId });
      if (like.deletedCount === 0) {
         return false;
      }
      return true;
   }

}