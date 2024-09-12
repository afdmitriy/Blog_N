import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Inject, NotFoundException, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BlogInputModel } from './models/input/blog.input';
import { BlogOutputModel } from './models/output/blog.output.models';
import { PostWithoutBlogInputModel } from '../../posts/api/models/input/post.input';
import { PostOutputWithLikesModel } from '../../posts/api/models/output/post.output.models';
import { BasicAuthGuard } from '../../../infrastructure/guards/auth-basic.guard';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PostCreateCommand } from '../../posts/application/use-cases/post.create.use-case';
import { CurrentUserId } from '../../../infrastructure/decorators/transform/current-user-id.param.decorator';
import { ResultStatus } from '../../../base/models/enums/enums';
import { BlogQueryRepository } from '../infrastructure/blog.query.repository';
import { BlogCreateCommand } from '../application/use-cases/blog.create.use-case';
import { BlogUpdateCommand } from '../application/use-cases/blog.update.use-case';
import { BlogDeleteCommand } from '../application/use-cases/blog.delete.use-case';
import { QueryPaginationPipe } from '../../../infrastructure/pipes/query.global.pipe';
import { QueryPaginationResult } from '../../../infrastructure/types/query-sort.type';
import { PaginationWithItems } from '../../../base/models/pagination';
import { PostUpdateCommand } from '../../posts/application/use-cases/post.update.use-case';
import { PostDeleteCommand } from '../../posts/application/use-cases/post.delete.use-case';
import { PostQueryRepository } from '../../posts/infrastructure/post.query.repository';

@Controller('sa/blogs')
export class BlogSuperAdminController {
   constructor(
      @Inject(BlogQueryRepository.name) private readonly blogQueryRepository: BlogQueryRepository,
      @Inject(PostQueryRepository.name) private readonly postQueryRepository: PostQueryRepository,
      private readonly queryBus: QueryBus,
      private readonly commandBus: CommandBus,
   ) { }

   @Get('')
   @UseGuards(BasicAuthGuard)
   async getBlogs(@Query(QueryPaginationPipe) queryParams: QueryPaginationResult): Promise<PaginationWithItems<BlogOutputModel>> {
      return await this.blogQueryRepository.getAll(queryParams);

   }

   @Get(':blogId')
   @UseGuards(BasicAuthGuard)
   async getBlogById(@Param('blogId') blogId: string): Promise<BlogOutputModel> {
      const blog = await this.blogQueryRepository.getById(blogId);
      if (!blog) {
         throw new HttpException('blog does not exist', HttpStatus.NOT_FOUND)
      }
      return blog

   }

   @Get(':blogId/posts')
   @UseGuards(BasicAuthGuard)
   async getPostsByBlogId(@Param('blogId') blogId: string,
   @Query(QueryPaginationPipe) queryParams: QueryPaginationResult, @CurrentUserId() userId: string): Promise<PaginationWithItems<PostOutputWithLikesModel> | PostOutputWithLikesModel | null> {
      return await this.postQueryRepository.getPosts(userId, queryParams, blogId)
   }

   @Post('')
   @UseGuards(BasicAuthGuard)
   async createBlog(@Body() inputBlog: BlogInputModel): Promise<BlogOutputModel | null> {
      const result = await this.commandBus.execute(new BlogCreateCommand(inputBlog))
      if (result.status !== ResultStatus.SUCCESS) throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR)
      return await this.blogQueryRepository.getById(result.data)
   }



   @Put(':blogId')
   @UseGuards(BasicAuthGuard)
   @HttpCode(204)
   async updateBlog(@Param('blogId') blogId: string, @Body() inputBlog: BlogInputModel): Promise<void> {
      const result = await this.commandBus.execute(new BlogUpdateCommand(blogId, inputBlog))
      if (result.status === ResultStatus.NOT_FOUND) throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
      if (result.status === ResultStatus.SUCCESS) {
         return
      }
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR)
   }

   @Delete(':blogId')
   @UseGuards(BasicAuthGuard)
   @HttpCode(204)
   async deleteBlog(@Param('blogId') blogId: string): Promise<void> {
      const result = await this.commandBus.execute(new BlogDeleteCommand(blogId))
      if (result.status === ResultStatus.NOT_FOUND) throw new HttpException('Blog not found', HttpStatus.NOT_FOUND)
      if (result.status === ResultStatus.SUCCESS) {
         return
      }
      throw new HttpException('Server error', HttpStatus.INTERNAL_SERVER_ERROR)
   }

   @Post(':blogId/posts')
   @UseGuards(BasicAuthGuard)
   @HttpCode(201)
   async createPostByBlogId(@Body() postData: PostWithoutBlogInputModel,
      @Param('blogId') blogId: string): Promise<PaginationWithItems<PostOutputWithLikesModel> | PostOutputWithLikesModel | null> {

      const newPost = {
         ...postData,
         blogId: blogId
      }
      const res = await this.commandBus.execute(new PostCreateCommand(newPost))
      if (res.status === ResultStatus.SUCCESS) return await this.postQueryRepository.getPosts(undefined, undefined, undefined, res.data)
      if (res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Blog`, HttpStatus.NOT_FOUND)
      throw new HttpException(`Server error`, HttpStatus.INTERNAL_SERVER_ERROR)
   }

   @Put(':blogId/posts/:postId')
   @UseGuards(BasicAuthGuard)
   @HttpCode(204)
   async updatePost(@Param('postId') postId: string, @Param('blogId') blogId: string,
      @Body() postData: PostWithoutBlogInputModel): Promise<void> {
      const blog = await this.blogQueryRepository.getById(blogId);
      if (!blog) throw new HttpException(`Blog do not exist`, HttpStatus.NOT_FOUND);
      const res = await this.commandBus.execute(new PostUpdateCommand(postId, postData))
      if (res.status === ResultStatus.NOT_FOUND) throw new NotFoundException('Post Not Found');
      return;

   }

   @Delete(':blogId/posts/:postId')
   @UseGuards(BasicAuthGuard)
   @HttpCode(204)
   async deletePost(@Param('postId') postId: string, @Param('blogId') blogId: string,) {

      const blog = await this.blogQueryRepository.getById(blogId);
      if (!blog) throw new HttpException(`Blog do not exist`, HttpStatus.NOT_FOUND);
      const res = await this.commandBus.execute(new PostDeleteCommand(postId))
      if (res.status === ResultStatus.NOT_FOUND) throw new NotFoundException('Post Not Found');
      return;
   }

}