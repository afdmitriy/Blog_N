import { Repository } from "typeorm";
import { Game_Orm } from "../../domain/entities/game.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GameStatusEnum } from "../../api/models/enums/enums";

@Injectable()
export class GameQueryRepository {
   constructor(@InjectRepository(Game_Orm) protected gameORMRepository: Repository<Game_Orm>) { }

   async getGame(userId?: string, gameId?: string) {

   }

   async getUnfinishedGameByUserId(userId: string) {
      return await this.gameORMRepository.createQueryBuilder('game')
        .leftJoinAndSelect('game.firstPlayer', 'firstPlayer')
        .leftJoinAndSelect('game.secondPlayer', 'secondPlayer')
        .where('game.firstPlayerId = :userId OR game.secondPlayerId = :userId', { userId })
        .andWhere('game.gameStatus != :finishedStatus', { finishedStatus: GameStatusEnum.Finished })
        .getOne();
   }

}