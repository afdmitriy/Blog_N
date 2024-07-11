import { Controller, Delete, HttpCode } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BLOG_MODEL_NAME } from "../blogs/infrastructure/blog.constants";
import { Model } from "mongoose";
import { BlogDocument } from "../blogs/domain/entities/blog.mongoose.entity";
import { POST_MODEL_NAME } from "../posts/infrastructure/post.constants";
import { PostDocument } from "../posts/domain/post.mongoose.entity";
import { USER_MODEL_NAME } from "../users/infrastructure/user.constants";
import { UserDocument } from "../users/domain/user.mongoose.entity";
import { Comment, CommentDocument } from "../comments/domain/comment.mongoose.entity";
import { LikeCommentDocument, LikeForComment } from "../comments/domain/like.for.comment.mongoose.entity";
import { LikeForPost, LikePostDocument } from "../posts/domain/like.for.post.mongoose.entity";
import { Session, SessionDocument } from "../security/domain/session.mongoose.entity";

@Controller('testing')
export class TestingController {
   constructor(@InjectModel(BLOG_MODEL_NAME) private blogModel: Model<BlogDocument>,
      @InjectModel(POST_MODEL_NAME) private postModel: Model<PostDocument>,
      @InjectModel(USER_MODEL_NAME) private userModel: Model<UserDocument>,
      @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
      @InjectModel(LikeForComment.name) private likeCommentModel: Model<LikeCommentDocument>,
      @InjectModel(LikeForPost.name) private likePostModel: Model<LikePostDocument>,
      @InjectModel(Session.name) private sessionModel: Model<SessionDocument>
   ) {}
   @Delete('all-data')
   @HttpCode(204)
   async testingAllData(): Promise<void> {
      console.log('Start deleting all data');
      await this.blogModel.deleteMany({})
      await this.postModel.deleteMany({})
      await this.userModel.deleteMany({})
      await this.commentModel.deleteMany({})
      await this.likeCommentModel.deleteMany({})
      await this.likePostModel.deleteMany({})
      await this.sessionModel.deleteMany({})
      console.log('All data is deleted');
      return;
   }
}