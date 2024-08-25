import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Session_Orm } from "../domain/session.typeOrm.entity";
import { Repository } from "typeorm";
import { SessionOutputModel } from "../api/models/output/session.output.model";

@Injectable()
export class SessionQueryRepository {
   constructor(@InjectRepository(Session_Orm) protected sessionRepository: Repository<Session_Orm>) { }

   async getSessionsByUserId(userId: string): Promise<SessionOutputModel[] | null> {
      const sessions = await this.sessionRepository.findBy([{ userId }]);
      return sessions.map((s) => this.mapToDto(s));
   }

   private mapToDto(session: Session_Orm): SessionOutputModel {
      return {
         lastActiveDate: session.updatedAt.toISOString(),
         title: session.deviceName,
         ip: session.ip,
         deviceId: session.id,
      };
   }
}