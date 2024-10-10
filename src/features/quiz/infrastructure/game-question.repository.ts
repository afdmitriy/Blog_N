import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { GameQuestion_Orm } from "../domain/entities/game-question.entity";

@Injectable()
export class GameQuestionRepository {
   constructor(@InjectRepository(GameQuestion_Orm) protected gameQuestionORMRepository: Repository<GameQuestion_Orm>) { }

   async save(gameQuestions: GameQuestion_Orm[]): Promise<GameQuestion_Orm | GameQuestion_Orm[]> {
      return this.gameQuestionORMRepository.save(gameQuestions)
   }
}