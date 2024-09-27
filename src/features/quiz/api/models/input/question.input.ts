import { ArrayNotEmpty, IsArray, IsBoolean, IsOptional, Length } from "class-validator";
import { Trim } from "../../../../../infrastructure/decorators/transform/trim.decorator";
import { Transform } from "class-transformer";
import { QueryBaseClass } from "../../../../../infrastructure/types/query-sort.type";
import { PublishedStatus } from "../enums/enums";

export class QuestionInputModel {
   @Trim()
   @Length(10, 500)
   body: string;
   @IsArray()
   @ArrayNotEmpty()
   @Transform(({ value }) => {
      return value.map((a) => a.toString().trim());
   })
   correctAnswers: string[]
}

export class QuestionPublishModel {
   @IsBoolean()
   published: boolean;
}


export class QuestionQueryClass extends QueryBaseClass {
   @IsOptional()
   @Transform(({ value }) => {
      return Object.values(PublishedStatus).includes(value) ? value : PublishedStatus.All;
   })
   publishedStatus: PublishedStatus;

   @IsOptional()
   bodySearchTerm: string;
}