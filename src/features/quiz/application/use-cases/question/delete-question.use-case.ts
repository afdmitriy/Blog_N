import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../../base/models/enums/enums";
import { Inject } from "@nestjs/common";
import { QuestionRepository } from "../../../infrastructure/quiz-repositories/question.repository";

export class QuestionDeleteCommand {
   constructor(public id: string,
   ) { }
}

@CommandHandler(QuestionDeleteCommand)
export class QuestionDeleteUseCase implements ICommandHandler<QuestionDeleteCommand> {
   constructor(
      @Inject(QuestionRepository.name) private readonly questionRepository: QuestionRepository,
   ) { }
   async execute(command: QuestionDeleteCommand): Promise<ResultObjectModel<string | null>> {
      try {
         const question = await this.questionRepository.getById(command.id)
         if (!question) return {
            data: null,
            errorMessage: 'Question not found',
            status: ResultStatus.NOT_FOUND
         }
         await this.questionRepository.deleteById(command.id)
         return {
            data: question.id,
            status: ResultStatus.SUCCESS
         }
      } catch (error) {
         console.log(error)
         throw error
      }
   }
}