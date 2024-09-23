import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LikeForComment_Orm } from "./domain/like-for-comment.typeOrm.entity";
import { LikeCommentRepository } from "./infrastructure/like.comment.repository";



@Module({
   imports: [TypeOrmModule.forFeature([LikeForComment_Orm]),
      // MongooseModule.forFeature([{ name: 'LikeForPost', schema: LikePostSchema }])
   ],
   providers: [
      {
         provide: LikeCommentRepository.name,
         useClass: LikeCommentRepository
      },
      ],
   exports: [LikeCommentRepository.name]
})
export class LikePostsModule {
}