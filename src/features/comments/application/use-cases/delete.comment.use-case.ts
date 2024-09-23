import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentRepository } from "../../infrastructure/comment.repository";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { Inject } from "@nestjs/common";

export class CommentDeleteCommand {
   constructor(public commentId: string,
   ) { }
}

@CommandHandler(CommentDeleteCommand)
export class CommentDeleteUseCase implements ICommandHandler<CommentDeleteCommand> {
   constructor(
      @Inject(CommentRepository.name) private readonly commentRepository: CommentRepository,
   ) { }
   async execute(command: CommentDeleteCommand): Promise<ResultObjectModel<boolean>> {
      const comment = await this.commentRepository.getById(command.commentId)
      if (!comment) return {
         data: null,
         errorMessage: 'Comment not found',
         status: ResultStatus.NOT_FOUND
      }
      await this.commentRepository.deleteById(command.commentId)
      return {
         data: null,
         status: ResultStatus.SUCCESS
      }
   }
}