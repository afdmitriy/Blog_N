import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CommentRepository } from "../../infrastructure/comment.repository";
import { ResultObjectModel } from "../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../base/models/enums/enums";
import { Inject } from "@nestjs/common";


export class CommentUpdateCommand {
   constructor(public commentId: string,
      public content: string,
   ) { }
}

@CommandHandler(CommentUpdateCommand)
export class CommentUpdateUseCase implements ICommandHandler<CommentUpdateCommand> {
   constructor(
      @Inject(CommentRepository.name) private readonly commentRepository: CommentRepository,
   ) { }
   async execute(command: CommentUpdateCommand): Promise<ResultObjectModel<boolean>> {
      try {
         const comment = await this.commentRepository.getById(command.commentId)
         if (!comment) return { data: null, status: ResultStatus.NOT_FOUND }
         comment.updateComment(command.content)
         await this.commentRepository.save(comment)
         return { data: true, status: ResultStatus.SUCCESS }
      } catch (error) {
         console.log(error)
         return { data: null, status: ResultStatus.SERVER_ERROR }
      }
   }
}