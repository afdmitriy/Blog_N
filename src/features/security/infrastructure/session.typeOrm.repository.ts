import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";
import { Session_Orm } from "../domain/session.typeOrm.entity";

@Injectable()
export class SessionRepository {
   constructor(@InjectRepository(Session_Orm) protected sessionRepository: Repository<Session_Orm>) { }

   async getById(id: string): Promise<Session_Orm | null> {
      const session = await this.sessionRepository.findOne({ where: { id } });
      return session || null;
   }

   async deleteById(id: string): Promise<void> {
      await this.sessionRepository.softDelete(id)
   }

   async deleteSessionsExcludeId(id: string, userId: string): Promise<void> {
      await this.sessionRepository.softDelete({
         userId: userId,
         id: Not(id)
      })
   }

   async save(session: Session_Orm): Promise<Session_Orm> {
      return this.sessionRepository.save(session)
   }
}