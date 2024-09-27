import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseTypeORMEntity } from "../../../../base/entities/base.entity";
import { Game } from "./game.entity";
import { Question } from "./question.entity";

@Entity()
export class GameQuestion extends BaseTypeORMEntity {

   @Column({ type: 'uuid' })
   gameId: string

   @Column({ type: 'uuid' })
   questionId: string

   @Column()
   index: number

   @ManyToOne(() => Game, (g) => g.gameQuestions, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'gameId' })
   user: Game;

   @ManyToOne(() => Question, (q) => q.gameQuestions, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'questionId' })
   question: Question;

}