import { Injectable } from "@nestjs/common";
import { PostRepository } from "../infrastructure/post.repository";
import { PaginationWithItems } from "src/base/models/pagination";
import { PostOutputWithLikesModel } from "../api/models/output/post.output.models";
import { PostQueryRepository } from "../infrastructure/post.query.repository";
import { PostInputModel, PostWithoutBlogInputModel } from "../api/models/input/post.input";
import { Post, PostDocument } from "../domain/post.mongoose.entity";
import { LikePostRepository } from "../infrastructure/like.post.repository";
import { BlogRepository } from "../../blogs/infrastructure/blog.repository";
import { QueryPaginationModel, QuerySortModel } from "../../../base/models/input/input.models";
import { LikeStatusEnum } from "../../../base/models/enums/enums";


@Injectable()
export class PostService {
   constructor(protected postRepository: PostRepository,
      protected postQueryRepository: PostQueryRepository,
      protected blogRepository: BlogRepository,
      protected likePostRepository: LikePostRepository
   ) { }

   async getQueryAllPosts(queryParams: QueryPaginationModel,
      // userId?: string
   ) {
      const postParams: QuerySortModel = {
         sortBy: queryParams.sortBy ?? 'createdAt',
         sortDirection: queryParams.sortDirection ?? 'desc',
         pageNumber: queryParams.pageNumber ? +queryParams.pageNumber : 1,
         pageSize: queryParams.pageSize ? +queryParams.pageSize : 10,
      };
      try {

         const posts = await this.postQueryRepository.getAllPosts(postParams);

         if (!posts) {
            return null;
         }

         const newPosts: any = { ...posts };

         newPosts.items.forEach(item => { 
            item.extendedLikesInfo = {  
               likesCount: 0,
               dislikesCount: 0,
               myStatus: LikeStatusEnum.None,
               newestLikes: []
            }
         })

         return newPosts

         // return this.postAddLikesInfoMapper(posts, userId);

      } catch (error) {
         console.log(error);
         return false;
      }
   }

   async getQueryPostsByBlogId(
      blogId: string,
      queryParams: QueryPaginationModel,
      //   userId?: string
   ): Promise<PaginationWithItems<PostOutputWithLikesModel> | false | null> {

      const blog = await this.blogRepository.getBlogById(blogId)

      if (!blog) return null

      const postParams: QuerySortModel = {
         sortBy: queryParams.sortBy ?? 'createdAt',
         sortDirection: queryParams.sortDirection ?? 'desc',
         pageNumber: queryParams.pageNumber ? +queryParams.pageNumber : 1,
         pageSize: queryParams.pageSize ? +queryParams.pageSize : 10,
      };

      try {
         const posts = await this.postQueryRepository.findPostsByBlogIdWithQuery(
            blogId,
            postParams
         );

         // return await this.postAddLikesInfoMapper(posts, userId);
         const newPosts: any = { ...posts };

         newPosts.items.forEach(item => { 
            item.extendedLikesInfo = {  
               likesCount: 0,
               dislikesCount: 0,
               myStatus: LikeStatusEnum.None,
               newestLikes: []
            }
         })
         return newPosts

      } catch (error) {
         console.log(error);
         return false;
      }
   }

   async createPost(
      postData: PostInputModel
      // ): Promise<ResultObjectModel<PostOutputWithLikesModel>> {
   ): Promise<PostOutputWithLikesModel | null> {
      const blog = await this.blogRepository.getBlogById(postData.blogId);
      if (!blog) {
         return null
      } 

      const newPostData = {
         ...postData,
         blogName: blog!.name
      }
      const newPost: Post = new Post(newPostData)
      try {

         const post = await this.postRepository.createPost(newPost);
         if (!post) {
            return null;
         }
         const addedPost = Post.toDto(post)
         return {
            ...addedPost,
            extendedLikesInfo: {
               likesCount: 0,
               dislikesCount: 0,
               myStatus: LikeStatusEnum.None,
               newestLikes: []
            }
         }
      } catch (error) {
         console.log(error);
         return null;
      }
   }

   async getPostWithLikes(postId: string) {
      const post = await this.postRepository.getPostById(postId);
      if (!post) {
         return null;
      }
      const postDto = Post.toDto(post)
      return {
         ...postDto,
         extendedLikesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: LikeStatusEnum.None,
            newestLikes: []
         }
      }
   }

   async updatePost(postId: string, postData: PostWithoutBlogInputModel): Promise<true | null> {
      const targetPost: PostDocument | null = await this.postRepository.getPostById(postId);
      if (!targetPost) return null;
  
      targetPost.updatePost(postData);
  
      await this.postRepository.savePost(targetPost);
      return true;

   }

   async deletePost(postId: string): Promise<true | null> {
      
      const targetPost = await this.postRepository.deletePost(postId)

      if (!targetPost) return null

      return true
      
   }
}   