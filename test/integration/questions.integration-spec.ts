import { getRepositoryToken } from "@nestjs/typeorm";
import { QuestionCreateCommand, QuestionCreateUseCase } from "../../src/features/quiz/application/use-cases/question/create-question.use-case";
import { Question_Orm } from "../../src/features/quiz/domain/entities/question.entity";
import { QuestionRepository } from "../../src/features/quiz/infrastructure/quiz-repositories/question.repository";
import { Test, TestingModule } from "@nestjs/testing";
import { ResultObjectModel } from "../../src/base/models/result.object.type";
import { ResultStatus } from "../../src/base/models/enums/enums";
import { AppModule } from "../../src/app.module";

describe('QuestionCreateUseCase', () => {
   let questionRepository: QuestionRepository;
   let questionCreateUseCase: QuestionCreateUseCase;
   let questionInput = {
      body: 'test test test',
      correctAnswers: ['test', 'test2', 'test3'],
   }
   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         imports: [AppModule]}).compile();

      questionCreateUseCase = module.get(QuestionCreateUseCase);


   });

   it('should create a question successfully', async () => {
      // Arrange
      const command = new QuestionCreateCommand(questionInput);
      const mockQuestion = { id: '123', ...questionInput };

      const questionResult = await questionCreateUseCase.execute(command)

      expect(questionResult.status).toBe('success')

      const res = await questionRepository.getById(questionResult.data!)

      expect(res?.body).toBe(command.question.body)


      

      // Мокаем метод save
      jest.spyOn(questionRepository, 'save').mockResolvedValue(mockQuestion);

      // Act
      const result: ResultObjectModel<string> = await questionCreateUseCase.execute(command);

      // Assert
      expect(result.status).toBe(ResultStatus.SUCCESS);
      expect(result.data).toBe(mockQuestion.id);
      expect(questionRepository.save).toHaveBeenCalledWith(expect.anything()); // Проверка, что save был вызван
   });

   it('should return SERVER_ERROR when save fails', async () => {
      // Arrange
      const questionInput = { title: 'Sample Question', content: 'This is a sample question.' };
      const command = new QuestionCreateCommand(questionInput);

      // Мокаем метод save, чтобы он возвращал null
      jest.spyOn(questionRepository, 'save').mockResolvedValue(null);

      // Act
      const result: ResultObjectModel<string> = await questionCreateUseCase.execute(command);

      // Assert
      expect(result.status).toBe(ResultStatus.SERVER_ERROR);
      expect(result.data).toBeNull();
   });

   it('should throw an error on unexpected exceptions', async () => {
      // Arrange
      const questionInput = { title: 'Sample Question', content: 'This is a sample question.' };
      const command = new QuestionCreateCommand(questionInput);

      // Мокаем метод save, чтобы он выбрасывал ошибку
      jest.spyOn(questionRepository, 'save').mockImplementation(() => {
         throw new Error('Unexpected error');
      });

      // Act & Assert
      await expect(questionCreateUseCase.execute(command)).rejects.toThrow('Unexpected error');
   });
});