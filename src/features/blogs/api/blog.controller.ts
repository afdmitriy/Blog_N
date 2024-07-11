import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BlogService } from '../application/blog.service';
import { BlogQueryRepository } from '../infrastructure/blog.query.repository';
import { BlogInputModel, BlogQueryModel, BlogSortModel } from './models/input/blog.input';
import { BlogOutputModel } from './models/output/blog.output.models';
import { PostService } from '../../posts/application/post.service';
import { QueryPaginationModel } from '../../../base/models/input/input.models';
import { PostWithoutBlogInputModel } from '../../posts/api/models/input/post.input';
import { PostOutputWithLikesModel } from '../../posts/api/models/output/post.output.models';
import { BasicAuthGuard } from '../../../infrastructure/guards/auth-basic.guard';
import mongoose from 'mongoose';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PostCreateCommand } from '../../posts/application/use-cases/create.post.use-case';
import { CurrentUserId } from '../../../infrastructure/decorators/transform/current-user-id.param.decorator';
import { PostsGetByBlogIdQuery } from '../../posts/application/use-cases/get.posts.by.blog.use-case';
import { ResultStatus } from '../../../base/models/enums/enums';

@Controller('blogs')
export class BlogController {
   constructor(protected readonly blogService: BlogService,
      protected readonly postService: PostService,
      protected readonly blogQueryRepository: BlogQueryRepository,
      private readonly queryBus: QueryBus,
      private readonly commandBus: CommandBus,
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
      if (!mongoose.Types.ObjectId.isValid(blogId)) throw new HttpException(`Blog do not exist`, HttpStatus.NOT_FOUND);
      const blog = await this.blogQueryRepository.getBlogById(blogId);
      if (!blog) {
         throw new HttpException('blog does not exist', HttpStatus.NOT_FOUND)
      }
      return blog

   }

   @Get(':blogId/posts')
   async getPostsByBlogId(@Param('blogId') blogId: string,
      @Query() queryParams: QueryPaginationModel,  @CurrentUserId() userId: string) {
      if (!mongoose.Types.ObjectId.isValid(blogId)) throw new HttpException(`Blog do not exist`, HttpStatus.NOT_FOUND);
      const res = await this.queryBus.execute(new PostsGetByBlogIdQuery(queryParams, blogId, userId))
      if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Posts or blog not found`, HttpStatus.NOT_FOUND)
      if(res.status === ResultStatus.SUCCESS) return res.data
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   }

   @Post('')
   @UseGuards(BasicAuthGuard)
   async createBlog(@Body() inputBlog: BlogInputModel): Promise<BlogOutputModel> {
      const result = await this.blogService.createBlog(inputBlog);
      if (result.status === ResultStatus.SUCCESS) {
         return result.data!;
      }
      throw new HttpException('blog does not created', HttpStatus.INTERNAL_SERVER_ERROR)
   }

   @Post(':blogId/posts')
   @UseGuards(BasicAuthGuard)
   async createPostByBlogId(@Body() postData: PostWithoutBlogInputModel,
      @Param('blogId') blogId: string): Promise<PostOutputWithLikesModel | null> {
      if (!mongoose.Types.ObjectId.isValid(blogId)) throw new HttpException(`Blog do not exist`, HttpStatus.NOT_FOUND);
      const newPost = {
         ...postData,
         blogId: blogId
      }
      const res = await this.commandBus.execute(new PostCreateCommand(newPost))
      if (res.status === ResultStatus.SUCCESS) return res.data
      if (res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Blog`, HttpStatus.NOT_FOUND)
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   }


   @Put(':blogId')
   @UseGuards(BasicAuthGuard)
   @HttpCode(204)
   async updateBlog(@Param('blogId') blogId: string, @Body() inputBlog: BlogInputModel): Promise<void> {
      if (!mongoose.Types.ObjectId.isValid(blogId)) throw new HttpException(`Blog do not exist`, HttpStatus.NOT_FOUND);
      const updateResult = await this.blogService.updateBlog(blogId, inputBlog);
      if (updateResult) return
      throw new HttpException(`blog does not exist`, HttpStatus.NOT_FOUND);
   }

   @Delete(':blogId')
   @UseGuards(BasicAuthGuard)
   @HttpCode(204)
   async deleteBlog(@Param('blogId') blogId: string): Promise<void> {
      if (!mongoose.Types.ObjectId.isValid(blogId)) throw new HttpException(`Blog do not exist`, HttpStatus.NOT_FOUND);
      const deleteResult = await this.blogService.deleteBlog(blogId);
      if (!deleteResult) throw new HttpException(`blog does not exist`, HttpStatus.NOT_FOUND);
      return

   }


}