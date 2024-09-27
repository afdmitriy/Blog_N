import { Controller, Get, HttpException, HttpStatus, Inject, Param, Query } from '@nestjs/common';
import { BlogOutputModel } from './models/output/blog.output.models';
import { CurrentUserId } from '../../../infrastructure/decorators/transform/current-user-id.param.decorator';
import { BlogQueryRepository } from '../infrastructure/blog.query.repository';
import { QueryPaginationPipe } from '../../../infrastructure/pipes/query.global.pipe';
import { QueryPaginationResult } from '../../../infrastructure/types/query-sort.type';
import { PaginationWithItems } from '../../../base/models/pagination';
import { PostQueryRepository } from '../../posts/infrastructure/post.query.repository';
import { PostOutputWithLikesModel } from '../../posts/api/models/output/post.output.models';

@Controller('blogs')
export class BlogController {
   constructor(
      @Inject(BlogQueryRepository.name) private readonly blogQueryRepository: BlogQueryRepository,
      @Inject(PostQueryRepository.name) private readonly postQueryRepository: PostQueryRepository,
   ) { }

   @Get('')
   async getBlogs(@Query(QueryPaginationPipe) queryParams: QueryPaginationResult): Promise<PaginationWithItems<BlogOutputModel>> {
      return await this.blogQueryRepository.getAll(queryParams);
   }

   @Get(':blogId')
   async getBlogById(@Param('blogId') blogId: string): Promise<BlogOutputModel> {
      const blog = await this.blogQueryRepository.getById(blogId);
      if (!blog) throw new HttpException('blog does not exist', HttpStatus.NOT_FOUND)
      return blog
   }

   @Get(':blogId/posts')
   async getPostsByBlogId(@Param('blogId') blogId: string,
      @Query(QueryPaginationPipe) queryParams: QueryPaginationResult, @CurrentUserId() userId: string): Promise<PaginationWithItems<PostOutputWithLikesModel> | PostOutputWithLikesModel | null> {
      return await this.postQueryRepository.getPosts(userId, queryParams, blogId)
   }
}