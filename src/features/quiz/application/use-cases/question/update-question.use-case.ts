import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../../base/models/enums/enums";
import { Inject } from "@nestjs/common";
import { QuestionRepository } from "../../../infrastructure/quiz-repositories/question.repository";
import { QuestionInputModel } from "../../../api/models/input/question.input";

export class QuestionUpdateCommand {
   constructor(public id: string,
      public question: QuestionInputModel
   ) { }
}

@CommandHandler(QuestionUpdateCommand)
export class QuestionUpdateUseCase implements ICommandHandler<QuestionUpdateCommand> {
   constructor(
      @Inject(QuestionRepository.name) private readonly questionRepository: QuestionRepository,
   ) { }
   async execute(command: QuestionUpdateCommand): Promise<ResultObjectModel<string | null>> {
      try {
         const question = await this.questionRepository.getById(command.id)
         if (!question) return {
            data: null,
            errorMessage: 'Question not found',
            status: ResultStatus.NOT_FOUND
         }
         question.updateQuestion(command.question)
         await this.questionRepository.save(question)
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