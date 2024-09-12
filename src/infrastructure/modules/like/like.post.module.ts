import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { LikePostRepository } from "../../../features/posts/infrastructure/like.post.repository";
import { LikePostSchema } from "../../../features/posts/domain/like.for.post.mongoose.entity";


@Module({
   imports: [MongooseModule.forFeature([{ name: 'LikeForPost', schema: LikePostSchema }])],
   providers: [LikePostRepository],
   exports: [LikePostRepository]
})
export class LikePostsModule {
}