import { Module } from "@nestjs/common";
import { TestingController } from "./testing.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { BlogSchema } from "../blogs/domain/entities/blog.mongoose.entity";
import { PostSchema } from "../posts/domain/post.mongoose.entity";
import { UserSchema } from "../users/domain/user.mongoose.entity";

@Module({
   imports: [MongooseModule.forFeature([{ name: 'Blog', schema: BlogSchema }]),
   MongooseModule.forFeature([{ name: 'Post', schema: PostSchema }]),
   MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
   ],
   controllers: [TestingController],
})
export class TestingModule {
}