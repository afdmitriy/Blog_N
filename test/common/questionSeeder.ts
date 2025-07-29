import { DataSource } from 'typeorm';
import { Question_Orm } from '../../src/features/quiz/domain/entities/question.entity';


const questions = [
   { body: 'Вопрос 1', answer: ['Ответ 1'] },
   { body: 'Вопрос 2', answer: ['Ответ 2'] },
   { body: 'Вопрос 3', answer: ['Ответ 3'] },
   { body: 'Вопрос 4', answer: ['Ответ 4'] },
   { body: 'Вопрос 5', answer: ['Ответ 5'] },
];

export class QuestionSeeder {
   private questionRepository;
   constructor(
      private dataSource: DataSource
   ) {
      this.questionRepository = this.dataSource.getRepository(Question_Orm);
   }

   // Метод для заполнения базы данных тестовыми вопросами
   async insertTestQuestions() {
      for (const question of questions) {
         const newQuestion = this.questionRepository.create({
            body: question.body,
            correctAnswers: question.answer,
            published: true,
         });
         await this.questionRepository.save(newQuestion);
      }
   }
}