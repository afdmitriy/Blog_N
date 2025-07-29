import { IsNotEmpty, IsString } from "class-validator";

export class AnswerInputModel {
   @IsNotEmpty()
   @IsString()
   answer: string
}