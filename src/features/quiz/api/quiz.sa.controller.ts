import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Inject, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { QuestionQueryRepository } from "../infrastructure/quiz-repositories/question.query.repository";
import { QuestionDeleteCommand } from "../application/use-cases/question/delete-question.use-case";
import { ResultStatus } from "../../../base/models/enums/enums";
import { BasicAuthGuard } from "../../../infrastructure/guards/auth-basic.guard";
import { QuestionUpdateCommand } from "../application/use-cases/question/update-question.use-case";
import { QuestionInputModel, QuestionPublishModel, QuestionQueryClass } from "./models/input/question.input";
import { QuestionPublishUpdateCommand } from "../application/use-cases/question/publish-question.use-case";
import { QuestionCreateCommand } from "../application/use-cases/question/create-question.use-case";
import { QuestionOutputModel } from "./models/output/question.output";
import { PaginationWithItems } from "../../../base/models/pagination";

@Controller('sa/quiz/questions')
export class SaQuizController {
   constructor(
      @Inject(QuestionQueryRepository.name) private readonly questionQueryRepository: QuestionQueryRepository,
      private readonly commandBus: CommandBus,
   ) { }

   @Get('')
   @UseGuards(BasicAuthGuard)
   async getQuestions(@Query() query: QuestionQueryClass): Promise<PaginationWithItems<QuestionOutputModel>> {
      return await this.questionQueryRepository.getQuestions(query)
   }

   @Post('')
   @UseGuards(BasicAuthGuard)
   @HttpCode(201)
   async createQuestion(@Body() question: QuestionInputModel): Promise<QuestionOutputModel | null> {
      const res = await this.commandBus.execute(new QuestionCreateCommand(question))
      if(res.status !== ResultStatus.SUCCESS) throw new HttpException('Server Error', HttpStatus.INTERNAL_SERVER_ERROR)
      return await this.questionQueryRepository.getQuestionById(res.data.id)
   }

   @Delete(':questionId')
   @UseGuards(BasicAuthGuard)
   @HttpCode(204)
   async deleteQuestion(@Param('questionId') questionId: string): Promise<void> {
      const res = await this.commandBus.execute(new QuestionDeleteCommand(questionId))
      if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Question not found`, HttpStatus.NOT_FOUND)
      return
   }

   @Put(':questionId')
   @UseGuards(BasicAuthGuard)
   @HttpCode(204)
   async updateQuestion(@Param('questionId') questionId: string, @Body() inputQuestion: QuestionInputModel): Promise<void> {
      const res = await this.commandBus.execute(new QuestionUpdateCommand(questionId, inputQuestion))
      if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Question not found`, HttpStatus.NOT_FOUND)
      return
   }

   @Put(':questionId/publish')
   @UseGuards(BasicAuthGuard)
   @HttpCode(204)
   async publishQuestion(@Param('questionId') questionId: string, @Body() publishedStatus: QuestionPublishModel): Promise<void> {
      const res = await this.commandBus.execute(new QuestionPublishUpdateCommand(questionId, publishedStatus.published))
      if(res.status === ResultStatus.NOT_FOUND) throw new HttpException(`Question not found`, HttpStatus.NOT_FOUND)
      return
   }
}