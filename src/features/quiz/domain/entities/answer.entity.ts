import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseTypeORMEntity } from "../../../../base/entities/base.entity";
import { Player } from "./player.entity";
import { AnswerStatusEnum } from "../../api/models/enums/enums";

@Entity()
export class Answer extends BaseTypeORMEntity {

   @Column({ type: 'enum', enum: AnswerStatusEnum})
   status: AnswerStatusEnum;

   @Column({ type: 'uuid' })
   playerId: string

   @ManyToOne(() => Player, (p) => p.answers, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'playerId' })
   player: Player;

}

