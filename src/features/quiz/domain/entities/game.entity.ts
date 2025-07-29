import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { BaseTypeORMEntity } from "../../../../base/entities/base.entity";
import { GameStatusEnum } from "../../api/models/enums/enums";
import { Player_Orm } from "./player.entity";
import { GameQuestion_Orm } from "./game-question.entity";

@Entity()
export class Game_Orm extends BaseTypeORMEntity {

   @Column({ type: 'enum', enum: GameStatusEnum, default: GameStatusEnum.PendingSecondPlayer })
   public gameStatus: GameStatusEnum;

   @Column({ type: 'uuid' })
   public firstPlayerId: string

   @Column({ type: 'uuid', default: null, nullable: true })
   public secondPlayerId: string | null

   @Column({ type: 'timestamp with time zone', default: null })
   public pairCreatedDate: Date

   @Column({ type: 'timestamp with time zone', default: null })
   public finishGameDate: Date

   @OneToOne(() => Player_Orm, { eager: true, onDelete: "CASCADE" })
   @JoinColumn({ name: 'firstPlayerId' })
   public firstPlayer: Player_Orm;

   @OneToOne(() => Player_Orm, { eager: true, onDelete: "CASCADE", nullable: true })
   @JoinColumn({ name: 'secondPlayerId' })
   public secondPlayer: Player_Orm;

   @OneToMany(() => GameQuestion_Orm, (gq) => gq.game, { eager: false, onDelete: "CASCADE" })
   public gameQuestions: GameQuestion_Orm[];

   static createGame(firstPlayerId: string): Game_Orm {
      const game = new this();
      game.firstPlayerId = firstPlayerId
      game.gameStatus = GameStatusEnum.PendingSecondPlayer
      return game;
   }

   addSecondPlayer(secondPlayerId: string): void {
      this.secondPlayerId = secondPlayerId
      this.gameStatus = GameStatusEnum.Active
      this.pairCreatedDate = new Date()
   }

   setGameFinished(): void {
      this.gameStatus = GameStatusEnum.Finished
      this.finishGameDate = new Date()
   }

}