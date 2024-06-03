import { Controller, Delete, HttpCode } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BLOG_MODEL_NAME } from "../blogs/infrastructure/blog.constants";
import { Model } from "mongoose";
import { BlogDocument } from "../blogs/domain/entities/blog.mongoose.entity";
import { POST_MODEL_NAME } from "../posts/infrastructure/post.constants";
import { PostDocument } from "../posts/domain/post.mongoose.entity";
import { USER_MODEL_NAME } from "../users/infrastructure/user.constants";
import { UserDocument } from "../users/domain/user.mongoose.entity";

@Controller('testing')
export class TestingController {
   constructor(@InjectModel(BLOG_MODEL_NAME) private blogModel: Model<BlogDocument>,
      @InjectModel(POST_MODEL_NAME) private postModel: Model<PostDocument>,
      @InjectModel(USER_MODEL_NAME) private userModel: Model<UserDocument>
   ) {}
   @Delete('all-data')
   @HttpCode(204)
   async testingAllData(): Promise<void> {
      console.log('Start deleting all data');
      await this.blogModel.deleteMany({})
      await this.postModel.deleteMany({})
      await this.userModel.deleteMany({})
      console.log('All data is deleted');
      return;
   }
}