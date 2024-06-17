import { Module } from "@nestjs/common";
import { LikePostSchema } from "./domain/like.for.post.mongoose.entity";
import { MongooseModule } from "@nestjs/mongoose";
import { LikePostRepository } from "./infrastructure/like.post.repository";

@Module({
   imports: [MongooseModule.forFeature([{ name: 'LikeForPost', schema: LikePostSchema }])],
   providers: [LikePostRepository],
   exports: [LikePostRepository]
})
export class LikePostsModule {
}