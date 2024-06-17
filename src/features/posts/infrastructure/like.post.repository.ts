import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { LikeForPost, LikePostDocument } from "../domain/like.for.post.mongoose.entity";
import { Model } from "mongoose";
import { LikeStatusEnum } from "src/base/models/enums/enums";



@Injectable()
export class LikePostRepository {
   constructor(@InjectModel(LikeForPost.name) private LikePostModel: Model<LikePostDocument>) { }
   async createLikeForPost(likeData: LikeForPost): Promise<boolean> {
      try {
         const like = await this.LikePostModel.create(likeData);
         if (!like._id) {
            return false;
         }
         return true;
      } catch (error) {
         console.log(error);
         return false;
      }
   }

   async findLikeByPostIdAndUserId(postId: string, userId: string): Promise<LikePostDocument | null> {
      try {
         const like = await this.LikePostModel.findOne({ postId: postId, userId: userId });
         if (!like) {
            console.log("Like not found");
            return null;
         }
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
         const likeCount = await this.LikePostModel.countDocuments({ postId: postId, likeStatus: "Like" }).lean();

         const dislikeCount = await this.LikePostModel.countDocuments({ postId: postId, likeStatus: "Dislike" }).lean();

         const likesCount = {
            likesCount: likeCount,
            dislikesCount: dislikeCount
         }
         console.log('Количество лайков: ', likesCount);
         return likesCount;
      } catch (error) {
         console.log(error);
         return null;
      }
   }

   async updateLikeStatus(id: string, likeStatus: LikeStatusEnum): Promise<boolean> {
      try {
         const res = await this.LikePostModel.updateOne({ _id: id }, { $set: { likeStatus: likeStatus } });
         return !!res.modifiedCount;

      } catch (error) {
         console.log(error);
         return false;
      }

   }

   async findThreeNewestLikesByPostId(postId: string): Promise<false | LikePostDocument[]> {
      try {
         const res = await this.LikePostModel.find({ postId: postId, likeStatus: LikeStatusEnum.Like }).sort({ createdAt: -1 }).limit(3);
         if (!res || res.length === 0) return []

         return res
      } catch (error) {
         console.log(error);
         return false;
      }
   }

}