import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ResultObjectModel } from "../../../../../base/models/result.object.type";
import { ResultStatus } from "../../../../../base/models/enums/enums";
import { Inject } from "@nestjs/common";
import { QuestionRepository } from "../../../infrastructure/quiz-repositories/question.repository";
import { QuestionInputModel } from "../../../api/models/input/question.input";
import { Question } from "../../../domain/entities/question.entity";


export class QuestionCreateCommand {
   constructor(public question: QuestionInputModel,  
   ) { }
}

@CommandHandler(QuestionCreateCommand)
export class QuestionCreateUseCase implements ICommandHandler<QuestionCreateCommand> {
   constructor(
      @Inject(QuestionRepository.name) private readonly questionRepository: QuestionRepository,
   ) { }
   async execute(command: QuestionCreateCommand): Promise<ResultObjectModel<string>> {
      try {
         const question = Question.createQuestionModel(command.question)
         const newQuestion = await this.questionRepository.save(question)
         if (!newQuestion) return {
            data: null,
            status: ResultStatus.SERVER_ERROR,
         }
         return {
            data: newQuestion.id,
            status: ResultStatus.SUCCESS
         }
      } catch (error) {
         console.log(error)
         throw error
      }
   }
}