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

   async deleteById(id: string): Promise<void> {
      await this.playerORMRepository.softDelete(id)
   }

   async save(player: Player_Orm): Promise<Player_Orm> {
      return this.playerORMRepository.save(player)
   }
}