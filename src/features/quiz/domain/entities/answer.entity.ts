import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseTypeORMEntity } from "../../../../base/entities/base.entity";
import { Player_Orm } from "./player.entity";
import { AnswerStatusEnum } from "../../api/models/enums/enums";

@Entity()
export class Answer_Orm extends BaseTypeORMEntity {

   @Column({ type: 'enum', enum: AnswerStatusEnum})
   status: AnswerStatusEnum;

   @Column()
   date: Date

   @Column({ type: 'uuid' })
   playerId: string

   @ManyToOne(() => Player_Orm, (p) => p.answers, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'playerId' })
   player: Player_Orm;


   static createAnswer(playerId: string, status: AnswerStatusEnum): Answer_Orm {
      const answer = new this();
      answer.playerId = playerId;
      answer.status = status;
      answer.date = new Date();
      return answer;
   }

}

