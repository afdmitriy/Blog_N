import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Post, Put, Query } from "@nestjs/common"
import { PostService } from "../application/post.service"
import { QueryPaginationModel} from "src/base/models/input/input.models"
import { PaginationWithItems } from "src/base/models/pagination"
import { PostOutputModel, PostOutputWithLikesModel } from "./models/output/post.output.models"
import { PostInputModel } from "./models/input/post.input"

@Controller('posts')
export class PostController {
   constructor(protected readonly postService: PostService
   ) { }

   @Get('')
   async getAllPosts(@Query() queryParams: QueryPaginationModel ): Promise<false | PaginationWithItems<PostOutputModel>> {
      
      return await this.postService.getQueryAllPosts(queryParams)
   }
   @Get(':postId')
   async getPostById(@Param('postId') postId: string): Promise<PostOutputWithLikesModel> {
      const post = await this.postService.getPostWithLikes(postId)
      if (!post) {
         throw new HttpException('post does not exist', HttpStatus.NOT_FOUND)
      }
      return post
   }

   @Post('')
   async createPost(@Body() inputPost: PostInputModel): Promise<PostOutputWithLikesModel> {
      await new Promise(resolve => setTimeout(resolve, 200))
      const result = await this.postService.createPost(inputPost)
      
      if (!result) throw new HttpException('My server error', HttpStatus.INTERNAL_SERVER_ERROR)
      return result
   }


   @Put(':postId')
   @HttpCode(204)
   async updatePost(@Param('postId') postId: string,
      @Body() postData: PostInputModel): Promise<void> {

         const res = await this.postService.updatePost(postId, postData)
         if (!res) throw new NotFoundException('Post Not Found');
         return;
         
      }

   @Delete(':postId')
   @HttpCode(204)
   async deletePost(@Param('postId') postId: string) {
      const delteResult = await this.postService.deletePost(postId);
      if (!delteResult) throw new NotFoundException('Post Not Found');
      return;
   }
}   