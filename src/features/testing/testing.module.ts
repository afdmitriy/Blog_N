import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User_Orm } from "../users/domain/user.typeOrm.entity";
import { Session_Orm } from "../security/domain/session.typeOrm.entity";
import { PasswordResetData } from "../auth/domain/recovery.password.data.entity";
import { LikeForPost_Orm } from "../posts/domain/like-for-post.typeOrm.entity";
import { Post_Orm } from "../posts/domain/post.typOrm.entity";
import { Blog_Orm } from "../blogs/domain/entities/blog.typeOrm.entity";
import { Comment_Orm } from "../comments/domain/comment.typeOrm.entity";
import { LikeForComment_Orm } from "../comments/domain/like-for-comment.typeOrm.entity";


@Module({
   imports: [
      TypeOrmModule.forFeature([User_Orm, Session_Orm, PasswordResetData,
         Blog_Orm, Post_Orm, LikeForPost_Orm, Comment_Orm, LikeForComment_Orm,
         ])
   ],
   controllers: [TestingController],
})
export class TestingModule {
}