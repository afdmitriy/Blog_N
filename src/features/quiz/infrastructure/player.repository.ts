import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Player_Orm } from "../domain/entities/player.entity";


@Injectable()
export class PlayerRepository {
   constructor(@InjectRepository(Player_Orm) protected playerORMRepository: Repository<Player_Orm>) { }

   async getById(id: string): Promise<Player_Orm | null> {
      const player = await this.playerORMRepository.findOne({ where: { id } });
      return player || null;
   }

   async getByUserId(userId: string): Promise<Player_Orm | null> {
      const player = await this.playerORMRepository.findOne({ where: { userId } })
      console.warn("player", player)
      console.log('Is player null or undefined?', player == null)
      return player
   }

   async deleteById(id: string): Promise<void> {
      await await this.playerORMRepository.softDelete(id)
   }

   async save(player: Player_Orm): Promise<Player_Orm> {
      return await this.playerORMRepository.save(player)
   }
}