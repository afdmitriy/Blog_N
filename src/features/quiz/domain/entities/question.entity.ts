import { Column, Entity, OneToMany } from "typeorm";
import { BaseTypeORMEntity } from "../../../../base/entities/base.entity";
import { QuestionInputModel } from "../../api/models/input/question.input";
import { GameQuestion } from "./game-question.entity";

@Entity()
export class Question extends BaseTypeORMEntity {

   @Column({ collation: 'C' })
   body: string;

   @Column({ name: 'correct_answers', type: 'jsonb', default: [] })
   correctAnswers;

   @Column({ default: false })
   published: boolean

   @OneToMany(() => GameQuestion, (gq) => gq.gameId)
   gameQuestions: GameQuestion[];

   static createQuestionModel(newQuestion: QuestionInputModel): Question {
      const question = new this();
      question.body = newQuestion.body
      question.correctAnswers = newQuestion.correctAnswers

      return question;
   }

   updateQuestion(params: QuestionInputModel): void {
      this.body = params.body;
      this.correctAnswers = params.correctAnswers;
   }

}