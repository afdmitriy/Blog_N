import { Column, Entity, OneToMany } from "typeorm";
import { BaseTypeORMEntity } from "../../../../base/entities/base.entity";
import { QuestionInputModel } from "../../api/models/input/question.input";
import { GameQuestion_Orm } from "./game-question.entity";

@Entity()
export class Question_Orm extends BaseTypeORMEntity {

   @Column({ collation: 'C' })
   body: string;

   @Column({ name: 'correct_answers', type: 'jsonb', default: [] })
   correctAnswers;

   @Column({ default: false })
   published: boolean

   @OneToMany(() => GameQuestion_Orm, (gq) => gq.gameId)
   gameQuestions: GameQuestion_Orm[];

   static createQuestionModel(newQuestion: QuestionInputModel): Question_Orm {
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