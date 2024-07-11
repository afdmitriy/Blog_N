import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LikeStatusEnum, ResultStatus } from "../../../../base/models/enums/enums";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { LikePostRepository } from "../../infrastructure/like.post.repository";
import { LikeForPost } from "../../domain/like.for.post.mongoose.entity";
import { PostRepository } from "../../infrastructure/post.repository";


export class UpdateLikeStatusForPostCommand {
   constructor(public postId: string,
      public likeStatus: LikeStatusEnum,
      public userId: string
   ) { }
}

@CommandHandler(UpdateLikeStatusForPostCommand)
export class UpdateLikeStatusForPostUseCase implements ICommandHandler<UpdateLikeStatusForPostCommand> {
   constructor(
      private readonly likePostRepository: LikePostRepository,
      private readonly postRepository: PostRepository
   ) { }
   async execute(command: UpdateLikeStatusForPostCommand): Promise<ResultObjectModel<boolean>> {
      try {
         const post = await this.postRepository.getPostById(command.postId)
         if (!post) {
            return {
               data: null,
               errorMessage: 'Post not found',
               status: ResultStatus.NOT_FOUND
            }
         }
         const like = await this.likePostRepository.findLikeByPostIdAndUserId(command.postId, command.userId)
         if ((like && like.likeStatus === command.likeStatus) || (!like && (command.likeStatus === LikeStatusEnum.None))) return {
            data: null,
            status: ResultStatus.SUCCESS
         }
         if (!like) {
            const likeData = {
               postId: command.postId,
               userId: command.userId,
               likeStatus: command.likeStatus
            }
            const newLike = LikeForPost.create(likeData)
            await this.likePostRepository.createLikeForPost(newLike)
            return {
               data: null,
               status: ResultStatus.SUCCESS
            }
         } else if (like && (command.likeStatus === LikeStatusEnum.None)) {
            await this.likePostRepository.deleteLikeById(command.postId)
            return {
               data: null,
               status: ResultStatus.SUCCESS
            }
         }
         like.likeStatus = command.likeStatus
         await like.save()
         return {
            data: null,
            status: ResultStatus.SUCCESS
         }
      } catch (error) {
         console.log(error)
         return {
            data: null,
            status: ResultStatus.SERVER_ERROR
         }
      }
   }
}