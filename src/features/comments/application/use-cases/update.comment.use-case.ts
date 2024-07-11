import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentRepository } from "../../infrastructure/comment.repository";
import { UserRepository } from "../../../users/infrastructure/user.repository";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../base/models/enums/enums";


export class CommentUpdateCommand {
   constructor(public commentId: string,
      public content: string,
   ) { }
}

@CommandHandler(CommentUpdateCommand)
export class CommentUpdateUseCase implements ICommandHandler<CommentUpdateCommand> {
   constructor(
      protected commentRepository: CommentRepository,
      protected userRepository: UserRepository
   ) { }
   async execute(command: CommentUpdateCommand): Promise<ResultObjectModel<boolean>> {
      try {
         const comment = await this.commentRepository.findCommentById(command.commentId)
         if (!comment) return { data: null, status: ResultStatus.NOT_FOUND }
         comment.update(command.content)
         await this.commentRepository.saveComment(comment)
         return { data: true, status: ResultStatus.SUCCESS }
      } catch (error) {
         console.log(error)
         return { data: null, status: ResultStatus.SERVER_ERROR }
      }
   }
}