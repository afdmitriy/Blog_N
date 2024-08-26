import { Injectable } from "@nestjs/common";
import { LikePostRepository } from "../../../features/posts/infrastructure/like.post.repository";
import { LikeCommentRepository } from "../../../features/comments/infrastructure/like.comment.repository";
import { LikeStatusEnum } from "../../../base/models/enums/enums";
import { LikeForComment } from "../../../features/comments/domain/like.for.comment.mongoose.entity";
import { LikeForPost } from "../../../features/posts/domain/like.for.post.mongoose.entity";
import { PaginationWithItems } from "../../../base/models/pagination";
import { CommentOutputModel, CommentWithLikesOutputModel } from "../../../features/comments/api/models/output/comment.output.model";
import { UserRepository } from "../../../features/users/infrastructure/user.repository";
import { LikesInfoForPost} from "../../../features/posts/api/models/output/output.likes.for.post";
import { PostOutputModel, PostOutputWithLikesModel} from "../../../features/posts/api/models/output/post.output.models";

@Injectable()
export class LikeService {
   constructor(private readonly likePostRepository: LikePostRepository,
      private readonly likeCommentRepository: LikeCommentRepository,
      private readonly userRepository: UserRepository
   ) { }

   async updateCommentLikeStatus(commentId: string, userId: string, likeStatus: LikeStatusEnum): Promise<boolean> {
      try {
         const like = await this.likeCommentRepository.findLikeByCommentIdAndUserId(commentId, userId)
         if (!like) {
            const likeData = {
               commentId: commentId,
               userId: userId,
               likeStatus: likeStatus
            }
            const newLike = LikeForComment.create(likeData) 
            await this.likeCommentRepository.createLikeForComment(newLike)
            return true
         }
         like.likeStatus = likeStatus
         await like.save()
         return true
      } catch (error) {
         console.log(error)
         return false
      }
   }

   async updatePostLikeStatus(postId: string, userId: string, likeStatus: LikeStatusEnum): Promise<boolean> {
      try {
         const like = await this.likePostRepository.findLikeByPostIdAndUserId(postId, userId)
         if (!like) {
            const likeData = {
               postId: postId,
               userId: userId,
               likeStatus: likeStatus
            }
            const newLike = LikeForPost.create(likeData) 
            await this.likePostRepository.createLikeForPost(newLike)
            return true
         }
         like.likeStatus = likeStatus
         await like.save()
         return true
      } catch (error) {
         console.log(error)
         return false
      }
   }

   async makeLikesInfoForComment(commentId: string, userId?: string) {
      const likescount = await this.likeCommentRepository.getCountOfLikesByCommentId(commentId)
   
      const likesInfo = {
         likesCount: likescount!.likesCount,
         dislikesCount: likescount!.dislikesCount,
         myStatus: LikeStatusEnum.None,
      }
      if (userId) {
         const likeStatus = await this.likeCommentRepository.findLikeByCommentIdAndUserId(commentId, userId)
         if (likeStatus) {
            likesInfo.myStatus = likeStatus.likeStatus
         }
         if (!likeStatus) {
            likesInfo.myStatus = LikeStatusEnum.None
         }
      }
      return likesInfo
   }

   async commentsAddLikesInfoForQuery(comments: PaginationWithItems<CommentOutputModel>, userId?: string): Promise<PaginationWithItems<CommentWithLikesOutputModel>> {
      const itemsWithLikes = comments.items.map(item =>
         this.makeLikesInfoForComment(item.id, userId).then(likesInfo => ({
            ...item,
            likesInfo
         }))
      );
   
      // Ожидаем завершения всех промисов
      const items = await Promise.all(itemsWithLikes);
   
      return {
         pagesCount: comments.pagesCount,
         page: comments.page,
         pageSize: comments.pageSize,
         totalCount: comments.totalCount,
         items
      };
   }

   async makeLikesInfoForPost(postId: string, userId?: string): Promise<LikesInfoForPost> {
      const likesCount = await this.likePostRepository.getCountOfLikesByPostId(postId)
   
      const likesInfo = {
         likesCount: likesCount!.likesCount,
         dislikesCount: likesCount!.dislikesCount,
         myStatus: LikeStatusEnum.None,
      }
      if (userId) {
         const likeStatus = await this.likePostRepository.findLikeByPostIdAndUserId(postId, userId)
         if (likeStatus) {
            likesInfo.myStatus = likeStatus.likeStatus
         }
         if (!likeStatus) {
            likesInfo.myStatus = LikeStatusEnum.None
         }
      }

      const extendedLikesInfo = {
         ...likesInfo,
         newestLikes: []
      }

      if (likesCount?.likesCount === 0) {
         return extendedLikesInfo
      }

      const newestLikes = await this.likePostRepository.findThreeNewestLikesByPostId(postId)
      if(!newestLikes) {
         return {...likesInfo,
            newestLikes: []
         }
      }
      const newLikes = newestLikes.map(like => (
         this.userRepository.getUserById(like.userId).then(user => ({
            addedAt: like.addedAt,
            userId: like.userId,
            login: user!.login
         }
      ))))
 
      const extendedLikes = await Promise.all(newLikes)

      return {...likesInfo,
         newestLikes: extendedLikes
      }
   }

   async postsAddLikesInfoForQuery(posts: PaginationWithItems<PostOutputModel>, userId?: string): Promise<PaginationWithItems<PostOutputWithLikesModel>> {
      const itemsWithLikes = posts.items.map(item =>
         this.makeLikesInfoForPost(item.id, userId).then(likesInfo => ({
            ...item,
            extendedLikesInfo: likesInfo
         }))
      );
   
      // Ожидаем завершения всех промисов
      const items = await Promise.all(itemsWithLikes);
   
      return {
         pagesCount: posts.pagesCount,
         page: posts.page,
         pageSize: posts.pageSize,
         totalCount: posts.totalCount,
         items
      };
   }
}