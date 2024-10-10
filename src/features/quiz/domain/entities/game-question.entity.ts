import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseTypeORMEntity } from "../../../../base/entities/base.entity";
import { Game_Orm } from "./game.entity";
import { Question_Orm } from "./question.entity";

@Entity()
export class GameQuestion_Orm extends BaseTypeORMEntity {

   @Column({ type: 'uuid' })
   gameId: string

   @Column({ type: 'uuid' })
   questionId: string

   @Column()
   index: number

   @ManyToOne(() => Game_Orm, (g) => g.gameQuestions, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'gameId' })
   user: Game_Orm;

   @ManyToOne(() => Question_Orm, (q) => q.gameQuestions, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'questionId' })
   question: Question_Orm;

   static createGameQuestion(gameId: string, questionId: string, index: number): GameQuestion_Orm {
      const gameQuestion = new this();
      gameQuestion.gameId = gameId;
      gameQuestion.questionId = questionId;
      gameQuestion.index = index;
      return gameQuestion;
   }


}