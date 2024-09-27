import { Controller, Get, Inject, Post } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

@Controller('pair-game-quiz/pairs')
export class GameController {
   constructor(
      @Inject(BlogQueryRepository.name) private readonly blogQueryRepository: BlogQueryRepository,
      @Inject(PostQueryRepository.name) private readonly postQueryRepository: PostQueryRepository,
      private readonly commandBus: CommandBus,
   ) { }

   @Get('my-current')
   async returnUnfinishedGame() {

   }

   @Get(':id')
   async returnGameById() {

   }

   @Post('connection')
   async startNewGame() {

   }

   @Post('my-current/answers')
   async submitAnswer() {

   }
}