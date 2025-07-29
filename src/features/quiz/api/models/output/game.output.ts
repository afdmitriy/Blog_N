import { AnswerStatusEnum } from "../enums/enums";

export interface GameOutputModel {
   id: string;
   firstPlayerProgress: {
      answers: {
         questionId: string;
         answerStatus: AnswerStatusEnum;
         addedAt: string;
      }[] | [];
      player: {
         id: string;
         login: string;
      };
      score: number;
   };
   secondPlayerProgress: {
      answers: {
         questionId: string;
         answerStatus: AnswerStatusEnum;
         addedAt: string;
      }[] | [];
      player: {
         id: string;
         login: string;
      };
      score: number;
   } | null;
   questions: {
      id: string;
      body: string;
   }[] | null;
   status: string;
   pairCreatedDate: string;
   startGameDate: string | null;
   finishGameDate: string | null;
}