import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentRepository } from "../../infrastructure/comment.repository";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../base/models/enums/enums";

export class CommentDeleteCommand {
   constructor(public commentId: string,
   ) { }
}

@CommandHandler(CommentDeleteCommand)
export class CommentDeleteUseCase implements ICommandHandler<CommentDeleteCommand> {
   constructor(
      protected commentRepository: CommentRepository,
   ) { }
   async execute(command: CommentDeleteCommand): Promise<ResultObjectModel<boolean>> {
      const comment = await this.commentRepository.findCommentById(command.commentId)
      if(!comment) return {
         data: null,
         errorMessage: 'Comment not found',
         status: ResultStatus.NOT_FOUND
      }

      await this.commentRepository.deleteCommentById(command.commentId)
      // if(!res) return {
      //    data: null,
      //    errorMessage: 'Comment not found',
      //    status: ResultStatus.NOT_FOUND
      // }
      return {
         data: null,
         status: ResultStatus.SUCCESS
      }
   }
}