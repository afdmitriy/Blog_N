import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsOptional, IsString, Length } from "class-validator";
import { Trim } from "../../../../../infrastructure/decorators/transform/trim.decorator";
import { Transform } from "class-transformer";
import { QueryBaseClass } from "../../../../../infrastructure/types/query-sort.type";
import { PublishedStatus } from "../enums/enums";

export class QuestionInputModel {
   @Trim()
   @Length(10, 500)
   body: string;
   
   @IsArray()
   @ArrayMinSize(1)
   @ArrayMaxSize(6)
   @IsString({ each: true })
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