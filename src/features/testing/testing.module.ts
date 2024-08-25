import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User_Orm } from "../users/domain/user.typeOrm.entity";
import { Session_Orm } from "../security/domain/session.typeOrm.entity";
import { PasswordResetData } from "../auth/domain/recovery.password.data.entity";


@Module({
   imports: [
      TypeOrmModule.forFeature([User_Orm, Session_Orm, PasswordResetData
         //  Blog_Orm, Post_Orm, Comment_Orm, Comment_like_Orm, Post_like_Orm
         ])
   // MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }]),
   // MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
   // MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
   // MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
   // MongooseModule.forFeature([{ name: LikeForComment.name, schema: LikeCommentSchema }]),
   // MongooseModule.forFeature([{ name: LikeForPost.name, schema: LikePostSchema }]),
   // MongooseModule.forFeature([{ name: Session.name, schema: SessionShema }])
   ],
   controllers: [TestingController],
})
export class TestingModule {
}