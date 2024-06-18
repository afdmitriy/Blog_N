import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { BlogService } from '../application/blog.service';
import { BlogQueryRepository } from '../infrastructure/blog.query.repository';
import { BlogInputModel, BlogQueryModel, BlogSortModel } from './models/input/blog.input';
import { BlogOutputModel } from './models/output/blog.output.models';

// import { ResultStatus } from 'src/base/models/enums/enums';
import { ResultStatus } from './../../../base/models/enums/enums';
import { PostService } from '../../posts/application/post.service';
import { QueryPaginationModel } from '../../../base/models/input/input.models';
import { PostInputModel } from '../../posts/api/models/input/post.input';
import { PostOutputWithLikesModel } from '../../posts/api/models/output/post.output.models';

@Controller('blogs')
export class BlogController {
   constructor(protected readonly blogService: BlogService,
      protected readonly postService: PostService,
      protected readonly blogQueryRepository: BlogQueryRepository   
   ) { }

   @Get('')
   async getBlogs(@Query() queryParams: BlogQueryModel) {
      const blogParams: BlogSortModel = {
         searchNameTerm: queryParams.searchNameTerm ?? null,
         sortBy: queryParams.sortBy ?? 'createdAt',
         sortDirection: queryParams.sortDirection ?? 'desc',
         pageNumber: queryParams.pageNumber ? +queryParams.pageNumber : 1,
         pageSize: queryParams.pageSize ? +queryParams.pageSize : 10,
      };
      const res = await this.blogQueryRepository.getAllBlogs(blogParams);
      if (!res) {
         throw new HttpException('blogs not found', HttpStatus.NOT_FOUND)
      }
      return res
   }

   @Get(':blogId')
   async getBlogById(@Param('blogId') blogId: string): Promise<BlogOutputModel> {
      const blog = await this.blogQueryRepository.getBlogById(blogId);
      if (!blog) {
         throw new HttpException('blog does not exist', HttpStatus.NOT_FOUND)
      }
      return blog

   }

   @Get(':blogId/posts')
   async getPostsByBlogId(@Param('blogId') blogId: string,
      @Query() queryParams: QueryPaginationModel) {
         console.log('11')
      const res = await this.postService.getQueryPostsByBlogId(blogId, queryParams)
      if (!res) {
         throw new HttpException('blog does not exist', HttpStatus.NOT_FOUND)
      }
      return res
   }

   @Post('')
   async createBlog(@Body() inputBlog: BlogInputModel): Promise<BlogOutputModel> {
      const result = await this.blogService.createBlog(inputBlog);
      if (result.status === ResultStatus.SUCCESS) {
         return result.data!;
      }
      throw new HttpException('blog does not created', HttpStatus.NOT_FOUND)
   }

   @Post(':blogId/posts')
   
   async createPostByBlogId(@Body() postData: Omit<PostInputModel, 'blogId'>,
      @Param('blogId') blogId: string): Promise<PostOutputWithLikesModel | null> {
         
         const newPost = {
            ...postData,
            blogId: blogId
         }
      const res =  await this.postService.createPost(newPost)   
      if(!res) throw new HttpException('blog does not found', HttpStatus.NOT_FOUND)
      return res
   }


   @Put(':blogId')
   @HttpCode(204)
   async updateBlog(@Param('blogId') blogId: string, @Body() inputBlog: BlogInputModel): Promise<void> {
      const updateResult = await this.blogService.updateBlog(blogId, inputBlog);
      if (updateResult) return
      throw new HttpException(`blog does not exist`, HttpStatus.NOT_FOUND);
   }

   @Delete(':blogId')
   @HttpCode(204)
   async deleteBlog(@Param('blogId') blogId: string): Promise<void> {
      const deleteResult = await this.blogService.deleteBlog(blogId);
      if (!deleteResult) throw new HttpException(`blog does not exist`, HttpStatus.NOT_FOUND);
      return
      
   }


}