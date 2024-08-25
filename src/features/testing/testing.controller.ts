import { Controller, Delete, HttpCode } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User_Orm } from "../users/domain/user.typeOrm.entity";
import { Repository } from "typeorm";
import { PasswordResetData } from "../auth/domain/recovery.password.data.entity";
import { Session_Orm } from "../security/domain/session.typeOrm.entity";


@Controller('testing')
export class TestingController {
   constructor(
      @InjectRepository(User_Orm) protected userRepository: Repository<User_Orm>,
      @InjectRepository(PasswordResetData) protected passRepository: Repository<PasswordResetData>,
      @InjectRepository(Session_Orm) protected sessionRepository: Repository<Session_Orm>,
      // @InjectModel(BLOG_MODEL_NAME) private blogModel: Model<BlogDocument>,
      // @InjectModel(POST_MODEL_NAME) private postModel: Model<PostDocument>,
      // @InjectModel(USER_MODEL_NAME) private userModel: Model<UserDocument>,
      // @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
      // @InjectModel(LikeForComment.name) private likeCommentModel: Model<LikeCommentDocument>,
      // @InjectModel(LikeForPost.name) private likePostModel: Model<LikePostDocument>,
      // @InjectModel(Session.name) private sessionModel: Model<SessionDocument>
   ) {}
   @Delete('all-data')
   @HttpCode(204)
   async testingAllData(): Promise<void> {
      console.log('Start deleting all data');
      await this.userRepository.delete({});
      await this.passRepository.delete({});
      await this.sessionRepository.delete({});
      // await this.blogRepository.delete({});
      // await this.postRepository.delete({});
      // await this.commentRepository.delete({});
      // await this.postLikeOrmRepository.delete({});
      // await this.commentLikeOrmRepository.delete({});


      // await this.blogModel.deleteMany({})
      // await this.postModel.deleteMany({})
      // await this.userModel.deleteMany({})
      // await this.commentModel.deleteMany({})
      // await this.likeCommentModel.deleteMany({})
      // await this.likePostModel.deleteMany({})
      // await this.sessionModel.deleteMany({})
      console.log('All data is deleted');
      return;
   }
}