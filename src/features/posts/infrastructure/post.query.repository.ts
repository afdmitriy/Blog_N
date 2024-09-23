import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post_Orm } from "../domain/post.typOrm.entity";
import { PostOutputWithLikesModel } from "../api/models/output/post.output.models";
import { LikeStatusEnum } from "../../../base/models/enums/enums";
import { QueryPaginationResult } from "../../../infrastructure/types/query-sort.type";
import { PaginationWithItems } from "../../../base/models/pagination";
import { LikeForPost_Orm } from "../domain/like-for-post.typeOrm.entity";
import { newestLikes } from "../api/models/output/output.likes.for.post";


type LikesInfo = {
   [postId: string]: newestLikes[];
 };

@Injectable()
export class PostQueryRepository {
   constructor(@InjectRepository(Post_Orm) protected postRepository: Repository<Post_Orm>,
      @InjectRepository(LikeForPost_Orm) protected postLikeRepository: Repository<LikeForPost_Orm>) { }

   async getPosts(userId?: string, sortData?: QueryPaginationResult, blogId?: string, postId?: string): Promise<PaginationWithItems<PostOutputWithLikesModel> | PostOutputWithLikesModel | null> {
      console.log('USERID', userId)
      const baseQuery = this.postRepository.createQueryBuilder('post')
         .leftJoin('post.blog', 'blog')
         .leftJoin('post.likes', 'like')
         .select([
            // можно использовать post.* чтобы получить ключи без пробелов
            'post.id',
            'post.title',
            'post.shortDescription',
            'post.content',
            'post.createdAt',
            'post.blogId',
            'blog.name',
            'SUM(CASE WHEN like.likeStatus = :like THEN 1 ELSE 0 END) AS likesCount',
            'SUM(CASE WHEN like.likeStatus = :dislike THEN 1 ELSE 0 END) AS dislikesCount',
            'MAX(CASE WHEN like.userId = :userId THEN like.likeStatus END) AS myStatus',

         ])
         .setParameters({ like: 'Like', dislike: 'Dislike', userId });
      // обернуть селекты в объекты а их в массив
      // или доставать три последних лайка отдельным запросом

      if (postId) {
         // Получение поста по ID
         const post = await baseQuery
            .where('post.id = :postId', { postId })
            .groupBy('post.id, blog.name')
            .getRawOne(); // Получаем один пост

         if (post) {
            const newestLikes = await this.getNewestLikesForAllPosts([postId]); // Получаем последние лайки для этого поста
            return this.mapPostToResponse(post, newestLikes[postId] || []);
         }
         return null;
      }

      // Получение всех постов (или постов по blogId)
      const skip = sortData ? (sortData.pageNumber - 1) * sortData.pageSize : 0;

      const postsQuery = baseQuery
         .where(blogId ? 'post.blogId = :blogId' : '1=1', { blogId })
         .groupBy('post.id, blog.name')
         .orderBy(sortData?.sortBy === 'blogName' ? 'blog.name' : `post.${sortData?.sortBy}`, sortData?.sortDirection)
         .limit(sortData?.pageSize)
         .offset(skip);

      const posts = await postsQuery.getRawMany(); // Получаем все посты
      //console.log('POSTS', posts)
      const totalCount = await this.postRepository.createQueryBuilder('post')
         .where(blogId ? 'post.blogId = :blogId' : '1=1', { blogId })
         .getCount();

      const postIds = posts.map(post => post.post_id);

      const newestLikes = await this.getNewestLikesForAllPosts(postIds);

      // Формируем ответ в нужном формате
      const postsOutput: PaginationWithItems<PostOutputWithLikesModel> = new PaginationWithItems(
         sortData?.pageNumber || 1,
         sortData?.pageSize || totalCount,
         totalCount,
         posts.map(post => this.mapPostToResponse(post, newestLikes[post.post_id] || []))
      );

      return postsOutput;
   }

   private async getNewestLikesForAllPosts(postIds: string[]): Promise<LikesInfo> {
      console.log('АЙДИШКИ', postIds)
      const limit = postIds.length * 3
      const likes = await this.postLikeRepository.createQueryBuilder('like')
         .select('like.postId, like.userId, like.createdAt, user.login')
         .innerJoin('like.user', 'user')
         .where('like.postId IN (:...postIds) AND like.likeStatus = :likeStatus', { postIds, likeStatus: 'Like' })
         .orderBy('like.createdAt', 'DESC')
         .limit(limit)
         .getRawMany();
      console.log('LIKES', likes)
      // Группируем лайки по postId

      const groupedLikes = likes.reduce((acc, like) => {
         if (!acc[like.postId]) {
             acc[like.postId] = [];
         }
         if (acc[like.postId].length < 3) { // Ограничиваем до 3 лайков
             acc[like.postId].push({ userId: like.userId, addedAt: like.createdAt.toISOString(), login: like.login });
         }
         return acc;
     }, {} as Record<string, newestLikes[]>);
 
     return groupedLikes

   }


   private mapPostToResponse(post: any, newestLikes: newestLikes[]): PostOutputWithLikesModel {
      console.log('Post MAPPER', post)

      return {
         id: post.post_id,
         title: post.post_title,
         shortDescription: post.post_shortDescription,
         content: post.post_content,
         blogId: post.post_blogId,
         blogName: post.blog_name,
         createdAt: post.post_createdAt.toISOString(),
         extendedLikesInfo: {
            likesCount: parseInt(post.likescount, 10) || 0,
            dislikesCount: parseInt(post.dislikescount, 10) || 0,
            myStatus: post.mystatus || LikeStatusEnum.None,
            newestLikes
         },
      };
   }
}
