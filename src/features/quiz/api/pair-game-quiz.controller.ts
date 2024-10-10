import { Controller, Get, HttpException, HttpStatus, Inject, Param, Post, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { JwtAuthGuard } from "../../../infrastructure/guards/jwt-auth.guard";
import { CurrentUserId } from "../../../infrastructure/decorators/transform/current-user-id.param.decorator";
import { StartGameCommand } from "../application/use-cases/start-quiz.use-case";
import { ResultStatus } from "../../../base/models/enums/enums";
import { GameQueryRepository } from "../infrastructure/pair-game-repositories/game.query.repository";

@Controller('pair-game-quiz/pairs')
export class GameController {
   constructor(
      @Inject(GameQueryRepository.name) private readonly gameQueryRepository: GameQueryRepository,
      private readonly commandBus: CommandBus,
   ) { }

   @Get('my-current')
   @UseGuards(JwtAuthGuard)
   async returnUnfinishedGame(@CurrentUserId() userId: string) {

   }

   @Get(':gameId')
   @UseGuards(JwtAuthGuard)
   async returnGameById(@Param('game') gameId: string) {

   }

   @Post('connection')
   @UseGuards(JwtAuthGuard)
   async startNewGame(@CurrentUserId() userId: string) {
      const res = await this.commandBus.execute(new StartGameCommand(userId))
      if (res.status == ResultStatus.FORBIDDEN) throw new HttpException(res.errorMessage, HttpStatus.FORBIDDEN)
      return await this.gameQueryRepository.getGame(res.data)
   }

   @Post('my-current/answers')
   @UseGuards(JwtAuthGuard)
   async submitAnswer(@CurrentUserId() userId: string) {

   }
}