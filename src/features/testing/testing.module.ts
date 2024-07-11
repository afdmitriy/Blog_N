import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogSchema } from "../blogs/domain/entities/blog.mongoose.entity";
import { PostSchema } from "../posts/domain/post.mongoose.entity";
import { UserSchema } from "../users/domain/user.mongoose.entity";
import { Comment, CommentSchema } from "../comments/domain/comment.mongoose.entity";
import { LikeCommentSchema, LikeForComment } from "../comments/domain/like.for.comment.mongoose.entity";
import { LikeForPost, LikePostSchema } from "../posts/domain/like.for.post.mongoose.entity";
import { Session, SessionShema } from "../security/domain/session.mongoose.entity";

@Module({
   imports: [MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }]),
   MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
   MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
   MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
   MongooseModule.forFeature([{ name: LikeForComment.name, schema: LikeCommentSchema }]),
   MongooseModule.forFeature([{ name: LikeForPost.name, schema: LikePostSchema }]),
   MongooseModule.forFeature([{ name: Session.name, schema: SessionShema }])
   ],
   controllers: [TestingController],
})
export class TestingModule {
}