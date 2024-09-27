import { Column, Entity, JoinColumn, OneToMany, OneToOne } from "typeorm";
import { BaseTypeORMEntity } from "../../../../base/entities/base.entity";
import { GameStatusEnum } from "../../api/models/enums/enums";
import { Player } from "./player.entity";
import { GameQuestion } from "./game-question.entity";

@Entity()
export class Game extends BaseTypeORMEntity {

   @Column({ type: 'enum', enum: GameStatusEnum })
   gameStatus: GameStatusEnum;

   @Column({ type: 'uuid' })
   firstPlayerId: string

   @Column({ type: 'uuid' })
   secondPlayerId: string | null

   @OneToOne(() => Player)
   @JoinColumn({ name: 'firstPlayerId' })
   public firstPlayer: Player;

   @OneToOne(() => Player)
   @JoinColumn({ name: 'secondPlayerId' })
   public secondPlayer: Player;

   @OneToMany(() => GameQuestion, (gq) => gq.gameId)
   gameQuestions: GameQuestion[];

}