import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseTypeORMEntity } from "../../../../base/entities/base.entity";
import { Player_Orm } from "./player.entity";
import { AnswerStatusEnum } from "../../api/models/enums/enums";
import { Question_Orm } from "./question.entity";

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

   @Column({ type: 'uuid' })
   questionId: string

   @ManyToOne(() => Question_Orm, (q) => q.answers, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'questionId' })
   question: Question_Orm;


   static createAnswer(playerId: string, status: AnswerStatusEnum, questionId: string): Answer_Orm {
      const answer = new this();
      answer.questionId = questionId;
      answer.playerId = playerId;
      answer.status = status;
      answer.date = new Date();
      return answer;
   }

}

