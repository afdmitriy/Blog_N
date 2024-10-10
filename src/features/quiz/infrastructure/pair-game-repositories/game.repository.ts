import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Game_Orm } from "../../domain/entities/game.entity";
import { GameStatusEnum } from "../../api/models/enums/enums";

@Injectable()
export class GameRepository {
   constructor(@InjectRepository(Game_Orm) protected gameORMRepository: Repository<Game_Orm>) { }

   async getById(id: string): Promise<Game_Orm | null> {
      const game = await this.gameORMRepository.findOne({ where: { id } });
      return game || null;
   }

   async getPendingGame(): Promise<Game_Orm | null> {
      return await this.gameORMRepository.createQueryBuilder('game')
         .where('game.gameStatus = :status', { status: GameStatusEnum.PendingSecondPlayer })
         .getOne();
   }

   async getUnfinishedGameByUserId(userId: string): Promise<Game_Orm | null> {
      const unfinishedGames = await this.gameORMRepository.createQueryBuilder("game")
         .leftJoinAndSelect("game.firstPlayer", "firstPlayer")
         .leftJoinAndSelect("game.secondPlayer", "secondPlayer")
         .where("firstPlayer.userId = :userId OR secondPlayer.userId = :userId", { userId })
         .andWhere('game.gameStatus != :finishedStatus', { finishedStatus: GameStatusEnum.Finished })
         .getOne();
      return unfinishedGames;
   }

   async deleteById(id: string): Promise<void> {
      await this.gameORMRepository.softDelete(id)
   }

   async save(game: Game_Orm): Promise<Game_Orm> {
      return this.gameORMRepository.save(game)
   }
}