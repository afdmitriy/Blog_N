import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LikeForPost_Orm } from "./domain/like-for-post.typeOrm.entity";
import { LikePostRepository } from "./infrastructure/like.post.repository";

@Module({
   imports: [TypeOrmModule.forFeature([LikeForPost_Orm]),
      // MongooseModule.forFeature([{ name: 'LikeForPost', schema: LikePostSchema }])
   ],
   providers: [
      {
         provide: LikePostRepository.name,
         useClass: LikePostRepository
      },
      ],
   exports: [LikePostRepository.name]
})
export class LikePostsModule {
}