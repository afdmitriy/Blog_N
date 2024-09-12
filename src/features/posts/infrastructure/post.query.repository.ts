import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post_Orm } from "../domain/post.typOrm.entity";
import { PostOutputWithLikesModel } from "../api/models/output/post.output.models";
import { LikeStatusEnum } from "../../../base/models/enums/enums";
import { QueryPaginationResult } from "../../../infrastructure/types/query-sort.type";
import { PaginationWithItems } from "../../../base/models/pagination";
import { LikeForPost_Orm } from "../domain/like-for-post.typeOrm.entity";

@Injectable()
export class PostQueryRepository {
   constructor(@InjectRepository(Post_Orm) protected postRepository: Repository<Post_Orm>,
      @InjectRepository(LikeForPost_Orm) protected postLikeRepository: Repository<LikeForPost_Orm>) { }

   // async getById(postId: string, userId?: string): Promise<PostOutputWithLikesModel | null> {
   //    const post = await this.postRepository.createQueryBuilder('post')
   //       .leftJoin('post.blog', 'blog')
   //       .select([
   //          'post.id',
   //          'post.title',
   //          'post.shortDescription',
   //          'post.content',
   //          'post.createdAt',
   //          'post.blogId',
   //          'blog.name',
   //       ])
   //       .where('post.id = :postId', { postId })
   //       .getOne();

   //    if (!post) {
   //       return null;
   //    }

   //    const { likesCount, dislikesCount, myStatus, newestLikes } = await this.getLikesInfo(postId, userId);

   //    return this.mapPostToResponse(post, likesCount, dislikesCount, myStatus, newestLikes);
   // }

   // async getAll(sortData: QueryPaginationResult,filter: any,  userId?: string): Promise<PaginationWithItems<PostOutputWithLikesModel>> {
   //    const skip = (sortData.pageNumber - 1) * sortData.pageSize;
   //    console.log('Sort data ', sortData, skip)
   //    const postsQuery = this.postRepository
   //       .createQueryBuilder('post')
   //       .select([
   //          'post.*',
   //          'blog.name as "blogName"',
   //       ])
   //       .leftJoin('post.blog', 'blog')
   //       .orderBy(`"${sortData.sortBy}"`, `${sortData.sortDirection}`)
   //       .limit(sortData.pageSize)
   //       .offset(skip)

   //       if(filter) postsQuery.where({blogId: filter.blogId})

   //       const posts = await postsQuery.getRawMany()
   //       .then(posts => posts.map(post => ({...post, blog: {
   //          name: post.blogName
   //       }})));
   //    const totalCount = await this.postRepository.createQueryBuilder('post')
   //       .getCount();


   //    const postsWithLikes = await Promise.all(posts.map(async (post) => {
   //       const { likesCount, dislikesCount, myStatus, newestLikes } = await this.getLikesInfo(post.id, userId);
   //       return this.mapPostToResponse(post, likesCount, dislikesCount, myStatus, newestLikes);
   //    }));

   //    const postsOutput: PaginationWithItems<PostOutputWithLikesModel> = new PaginationWithItems(
   //       sortData.pageNumber,
   //       sortData.pageSize,
   //       totalCount,
   //       postsWithLikes,
   //    );

   //    return postsOutput;
   // }

   // async getPostsForBlog(blogId: string, sortData: QueryPaginationResult, userId?: string): Promise<PaginationWithItems<PostOutputWithLikesModel>> {
   //    const skip = (sortData.pageNumber - 1) * sortData.pageSize;

   //    const posts = await this.postRepository.createQueryBuilder('post')
   //       .leftJoin('post.blog', 'blog')
   //       .select([
   //          'post.id',
   //          'post.title',
   //          'post.shortDescription',
   //          'post.content',
   //          'post.createdAt',
   //          'post.blogId',
   //          'blog.name',
   //       ])
   //       .where('post.blogId = :blogId', { blogId })
   //       .orderBy(sortData.sortBy === 'blogName' ? 'blog.name' : `post.${sortData.sortBy}`, sortData.sortDirection)
   //       .take(sortData.pageSize)
   //       .skip(skip)
   //       .getMany();


   //    const totalCount = await this.postRepository.createQueryBuilder('post')
   //       .where('post.blogId = :blogId', { blogId })
   //       .getCount();

   //    // Получаем информацию о лайках для каждого поста
   //    const postsWithLikes = await Promise.all(posts.map(async (post) => {
   //       const { likesCount, dislikesCount, myStatus, newestLikes } = await this.getLikesInfo(post.id, userId);
   //       return this.mapPostToResponse(post, likesCount, dislikesCount, myStatus, newestLikes);
   //    }));

   //    // Формируем ответ с пагинацией
   //    const postsOutput: PaginationWithItems<PostOutputWithLikesModel> = new PaginationWithItems(
   //       sortData.pageNumber,
   //       sortData.pageSize,
   //       totalCount,
   //       postsWithLikes,
   //    );

   //    return postsOutput;
   // }

   //    async getPostsForBlog(blogId: string, sortData: QueryPaginationResult, userId?: string): Promise<PaginationWithItems<PostOutputWithLikesModel>> {
   //       const skip = (sortData.pageNumber - 1) * sortData.pageSize;

   //       const posts = await this.postRepository.createQueryBuilder('post')
   //           .leftJoin('post.blog', 'blog')
   //           .leftJoin('post.likes', 'like') // Join with likes to get likes data
   //           .select([
   //               'post.id',
   //               'post.title',
   //               'post.shortDescription',
   //               'post.content',
   //               'post.createdAt',
   //               'post.blogId',
   //               'blog.name',
   //               'SUM(CASE WHEN like.likeStatus = :like THEN 1 ELSE 0 END) AS likesCount',
   //               'SUM(CASE WHEN like.likeStatus = :dislike THEN 1 ELSE 0 END) AS dislikesCount',
   //               'MAX(CASE WHEN like.userId = :userId THEN like.likeStatus END) AS myStatus',
   //                `(SELECT JSON_AGG(like) FROM (SELECT userId, createdAt FROM post_like WHERE postId = post.id AND likeStatus = 'Like' ORDER BY createdAt DESC LIMIT 3) AS like) AS newestLikes`
   //           ])
   //           .where('post.blogId = :blogId', { blogId })
   //           .setParameters({ like: 'Like', dislike: 'Dislike', userId })
   //           .groupBy('post.id, blog.name')
   //           .orderBy(sortData.sortBy === 'blogName' ? 'blog.name' : `post.${sortData.sortBy}`, sortData.sortDirection)
   //           .take(sortData.pageSize)
   //           .skip(skip)
   //           .getRawMany(); 

   //       const totalCount = await this.postRepository.createQueryBuilder('post')
   //           .where('post.blogId = :blogId', { blogId })
   //           .getCount();

   //       // Map posts to response format
   //       const postsOutput: PaginationWithItems<PostOutputWithLikesModel> = new PaginationWithItems(
   //           sortData.pageNumber,
   //           sortData.pageSize,
   //           totalCount,
   //           posts.map(post => this.mapPostToResponse(post))
   //       );

   //       return postsOutput;
   //   }

   //    private async getLikesInfo(postId: string, userId?: string) {
   //       // Получаем количество лайков и дизлайков
   //       const likesData = await this.postLikeRepository.createQueryBuilder('like')
   //          .select([
   //             'SUM(CASE WHEN like.likeStatus = :like THEN 1 ELSE 0 END) AS likesCount',
   //             'SUM(CASE WHEN like.likeStatus = :dislike THEN 1 ELSE 0 END) AS dislikesCount'
   //          ])
   //          .where('like.postId = :postId', { postId })
   //          .setParameters({ like: 'Like', dislike: 'Dislike' })
   //          .getRawOne();

   //       const likesCount = likesData ? parseInt(likesData.likesCount, 10) || 0 : 0;
   //       const dislikesCount = likesData ? parseInt(likesData.dislikesCount, 10) || 0 : 0;

   //       // Получаем статус лайка для конкретного пользователя
   //       const userLike = userId ? await this.postLikeRepository.createQueryBuilder('like')
   //          .where('like.postId = :postId', { postId })
   //          .andWhere('like.userId = :userId', { userId })
   //          .getOne() : null;

   //       const myStatus = userLike ? userLike.likeStatus : LikeStatusEnum.None;

   //       // Получаем три последних лайка
   //       const newestLikes = await this.postLikeRepository.createQueryBuilder('like')
   //          .where('like.postId = :postId', { postId })
   //          .andWhere('like.likeStatus = :like', { like: 'Like' })
   //          .orderBy('like.createdAt', 'DESC')
   //          .take(3)
   //          .getMany(); 

   //       return {
   //          likesCount,
   //          dislikesCount,
   //          myStatus,
   //          newestLikes: newestLikes.map(like => ({
   //             addedAt: like.createdAt.toISOString(),
   //             userId: like.userId,
   //             login: like.user.login,
   //          })),
   //       };
   //    }


   async getPosts(userId?: string, sortData?: QueryPaginationResult, blogId?: string, postId?: string): Promise<PaginationWithItems<PostOutputWithLikesModel> | PostOutputWithLikesModel | null> {
      const baseQuery = this.postRepository.createQueryBuilder('post')
         .leftJoin('post.blog', 'blog')
         .leftJoin('post.likes', 'like')
         .select([
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
            const newestLikes = await this.getNewestLikesForAllPosts([post.id]); // Получаем последние лайки для этого поста
            return this.mapPostToResponse(post, newestLikes[post.id] || []);
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
      console.log('POSTS', posts)
      const totalCount = await this.postRepository.createQueryBuilder('post')
         .where(blogId ? 'post.blogId = :blogId' : '1=1', { blogId })
         .getCount();

         const postIds = posts.map(post => post.post_id);
         console.log('POSTIDS', postIds)
         const newestLikes = await this.getNewestLikesForAllPosts(postIds);

      // Формируем ответ в нужном формате
      const postsOutput: PaginationWithItems<PostOutputWithLikesModel> = new PaginationWithItems(
         sortData?.pageNumber || 1,
         sortData?.pageSize || totalCount,
         totalCount,
         posts.map(post => this.mapPostToResponse(post, newestLikes[post.id] || []))
      );

      return postsOutput;
   }

   private async getNewestLikesForAllPosts(postIds: string[]): Promise<{ [key: string]: any[] }> {
      const likes = await this.postLikeRepository.createQueryBuilder('like')
         .select('like.postId, like.userId, like.createdAt, user.login')
         .innerJoin('like.user', 'user')
         .where('like.postId IN (:...postIds) AND like.likeStatus = :likeStatus', { postIds, likeStatus: 'Like' })
         .orderBy('like.createdAt', 'DESC')
         .limit(3)
         .getRawMany();

      // Группируем лайки по postId
      return likes.reduce((acc, like) => {
         if (!acc[like.postId]) {
            acc[like.postId] = [];
         }
         acc[like.postId].push({ userId: like.userId, addeddAt: like.createdAt, login: like.login });
         return acc;
      }, {} as { [key: string]: any[] });
   }


   private mapPostToResponse(post: any, newestLikes: any[]): PostOutputWithLikesModel {
      console.log('MAPPER', post)
      return {
         id: post.post_id,
         title: post.post_title,
         shortDescription: post.post_shortDescription,
         content: post.post_content,
         blogId: post.post_blogId,
         blogName: post.blog_name,
         createdAt: post.post_createdAt.toISOString(),
         extendedLikesInfo: {
            likesCount: parseInt(post.likesCount, 10) || 0,
            dislikesCount: parseInt(post.dislikesCount, 10) || 0,
            myStatus: post.myStatus || LikeStatusEnum.None,
            newestLikes: newestLikes
         },
      };
   }
}
