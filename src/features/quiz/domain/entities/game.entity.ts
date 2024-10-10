import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { BaseTypeORMEntity } from "../../../../base/entities/base.entity";
import { GameStatusEnum } from "../../api/models/enums/enums";
import { Player_Orm } from "./player.entity";
import { GameQuestion_Orm } from "./game-question.entity";

@Entity()
export class Game_Orm extends BaseTypeORMEntity {

   @Column({ type: 'enum', enum: GameStatusEnum, default: GameStatusEnum.PendingSecondPlayer })
   gameStatus: GameStatusEnum;

   @Column({ type: 'uuid' })
   firstPlayerId: string

   @Column({ type: 'uuid', default: null })
   secondPlayerId: string | null

   @OneToOne(() => Player_Orm)
   @JoinColumn({ name: 'firstPlayerId' })
   public firstPlayer: Player_Orm;

   @OneToOne(() => Player_Orm)
   @JoinColumn({ name: 'secondPlayerId' })
   public secondPlayer: Player_Orm;

   @OneToMany(() => GameQuestion_Orm, (gq) => gq.gameId)
   gameQuestions: GameQuestion_Orm[];

   static createGame(firstPlayerId: string): Game_Orm {
      const game = new this();
      game.firstPlayerId = firstPlayerId
      game.gameStatus = GameStatusEnum.PendingSecondPlayer
      return game;
   }

   addSecondPlayer(secondPlayerId: string): void {
      this.secondPlayerId = secondPlayerId
   }

}