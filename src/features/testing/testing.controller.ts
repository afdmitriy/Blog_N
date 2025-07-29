import { Controller, Delete, HttpCode } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User_Orm } from "../users/domain/user.typeOrm.entity";
import { Repository } from "typeorm";
import { PasswordResetData } from "../auth/domain/recovery.password.data.entity";
import { Session_Orm } from "../security/domain/session.typeOrm.entity";
import { Blog_Orm } from "../blogs/domain/entities/blog.typeOrm.entity";
import { Post_Orm } from "../posts/domain/post.typOrm.entity";
import { Comment_Orm } from "../comments/domain/comment.typeOrm.entity";
import { LikeForComment_Orm } from "../comments/domain/like-for-comment.typeOrm.entity";
import { LikeForPost_Orm } from "../posts/domain/like-for-post.typeOrm.entity";
import { Question_Orm } from "../quiz/domain/entities/question.entity";
import { Game_Orm } from "../quiz/domain/entities/game.entity";
import { GameQuestion_Orm } from "../quiz/domain/entities/game-question.entity";
import { Answer_Orm } from "../quiz/domain/entities/answer.entity";
import { Player_Orm } from "../quiz/domain/entities/player.entity";


@Controller('testing')
export class TestingController {
   constructor(
      @InjectRepository(User_Orm) protected userRepository: Repository<User_Orm>,
      @InjectRepository(PasswordResetData) protected passRepository: Repository<PasswordResetData>,
      @InjectRepository(Session_Orm) protected sessionRepository: Repository<Session_Orm>,
      @InjectRepository(Blog_Orm) protected blogRepository: Repository<Blog_Orm>,
      @InjectRepository(Post_Orm) protected postRepository: Repository<Post_Orm>,
      @InjectRepository(LikeForPost_Orm) protected likeForPostRepository: Repository<LikeForPost_Orm>,
      @InjectRepository(Comment_Orm) protected commentRepository: Repository<Comment_Orm>,
      @InjectRepository(LikeForComment_Orm) protected likeForCommentRepository: Repository<LikeForComment_Orm>,
      @InjectRepository(Question_Orm) protected questionRepository: Repository<Question_Orm>,
      @InjectRepository(Game_Orm) protected gameRepository: Repository<Game_Orm>,
      @InjectRepository(GameQuestion_Orm) protected gameQuestionRepository: Repository<GameQuestion_Orm>,
      @InjectRepository(Answer_Orm) protected answerRepository: Repository<Answer_Orm>,
      @InjectRepository(Player_Orm) protected playerRepository: Repository<Player_Orm>,


   ) {}
   @Delete('all-data')
   @HttpCode(204)
   async testingAllData(): Promise<void> {
      console.log('Start deleting all data');
      await this.userRepository.delete({});
      await this.passRepository.delete({});
      await this.sessionRepository.delete({});
      await this.blogRepository.delete({});
      await this.postRepository.delete({});
      await this.commentRepository.delete({});
      await this.likeForCommentRepository.delete({});
      await this.likeForPostRepository.delete({});
      await this.questionRepository.delete({})
      await this.gameRepository.delete({})
      await this.gameQuestionRepository.delete({})
      await this.answerRepository.delete({})
      await this.playerRepository.delete({})


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