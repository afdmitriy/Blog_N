import { PostInputModel } from "../input/post.input";
import { LikesInfoForPost } from "../likesForPosts/output.likes.for.post";

export interface PostOutputModel extends PostInputModel {
   id: string;
   blogName: string
   createdAt: string
}

export interface PostOutputWithLikesModel extends PostOutputModel {
   extendedLikesInfo: LikesInfoForPost
}

