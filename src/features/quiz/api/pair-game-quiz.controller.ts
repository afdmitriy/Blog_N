import { BadRequestException, Body, Controller, Get, HttpCode, HttpException, HttpStatus, Inject, NotFoundException, Param, Post, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "../../../infrastructure/guards/jwt-auth.guard";
import { CurrentUserId } from "../../../infrastructure/decorators/transform/current-user-id.param.decorator";
import { StartGameCommand } from "../application/use-cases/start-quiz.use-case";
import { ResultStatus } from "../../../base/models/enums/enums";
import { GameQueryRepository } from "../infrastructure/pair-game-repositories/game.query.repository";
import { SendAnswerCommand } from "../application/use-cases/send-answer.use-case";
import { AnswerQueryRepository } from "../infrastructure/answer.query.repository";
import { validate as isUuid } from 'uuid';
import { AnswerInputModel } from "./models/input/quiz.input";

@Controller('pair-game-quiz/pairs')
export class GameController {
   constructor(
      @Inject(GameQueryRepository.name) private readonly gameQueryRepository: GameQueryRepository,
      @Inject(AnswerQueryRepository.name) private readonly answerQueryRepository: AnswerQueryRepository,
      private readonly commandBus: CommandBus,
   ) { }

   @Get('my-current')
   @UseGuards(JwtAuthGuard)
   async returnUnfinishedGame(@CurrentUserId() userId: string) {
      const includeFinished = false
      const game = await this.gameQueryRepository.getGame({ userId, includeFinished })
      if (game.length === 0) throw new NotFoundException();
      return game[0]
   }

   @Get(':gameId')
   @UseGuards(JwtAuthGuard)
   async returnGameById(@Param('gameId') gameId: string, @CurrentUserId() userId: string) {
      if (!isUuid(gameId)) throw new BadRequestException();
      const game = await this.gameQueryRepository.getGame({ gameId: gameId })
     console.log('GET GAME ID', game)
      if (game.length === 0) throw new NotFoundException();
      if (!game[0].secondPlayerProgress) {
         if (game[0].firstPlayerProgress.player.id !== userId) throw new HttpException('You are not the player of this game', HttpStatus.FORBIDDEN)
         return game[0]
      }
      if ((game[0].firstPlayerProgress.player.id !== userId) || (game[0].secondPlayerProgress.player.id !== userId)) throw new HttpException('You are not the player of this game', HttpStatus.FORBIDDEN)
      return game[0]
   }

   @Post('connection')
   @HttpCode(200)
   @UseGuards(JwtAuthGuard)
   async startNewGame(@CurrentUserId() userId: string) {
      const res = await this.commandBus.execute(new StartGameCommand(userId))
      if (res.status == ResultStatus.FORBIDDEN) throw new HttpException(res.errorMessage, HttpStatus.FORBIDDEN)
      const game = await this.gameQueryRepository.getGame({gameId: res.data})
      return game[0]
   }

   @Post('my-current/answers')
   @HttpCode(200)
   @UseGuards(JwtAuthGuard)
   async submitAnswer(@CurrentUserId() userId: string, @Body() answer: AnswerInputModel) {
      const res = await this.commandBus.execute(new SendAnswerCommand(userId, answer.answer))
      if (res.status == ResultStatus.FORBIDDEN) throw new HttpException(res.errorMessage, HttpStatus.FORBIDDEN)
      return await this.answerQueryRepository.getAnswer(res.data)
   }
}