import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../../base/models/enums/enums";
import { Inject } from "@nestjs/common";
import { QuestionRepository } from "../../../infrastructure/quiz-repositories/question.repository";

export class QuestionPublishUpdateCommand {
   constructor(public id: string,
      public statusPublished: boolean
   ) { }
}

@CommandHandler(QuestionPublishUpdateCommand)
export class QuestionPublishUpdateUseCase implements ICommandHandler<QuestionPublishUpdateCommand> {
   constructor(
      @Inject(QuestionRepository.name) private readonly questionRepository: QuestionRepository,
   ) { }
   async execute(command: QuestionPublishUpdateCommand): Promise<ResultObjectModel<null>> {
      try {
         const question = await this.questionRepository.getById(command.id)
         if (!question) return {
            data: null,
            errorMessage: 'Question not found',
            status: ResultStatus.NOT_FOUND
         }
         if (question.published === command.statusPublished) return {
            data: null,
            status: ResultStatus.SUCCESS
         }
         question.published = command.statusPublished
         await this.questionRepository.save(question)
         return {
            data: null,
            status: ResultStatus.SUCCESS
         }
      } catch (error) {
         console.log(error)
         throw error
      }
   }
}