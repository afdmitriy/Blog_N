import { InjectModel } from "@nestjs/mongoose";
import { Session, SessionDocument } from "../domain/session.mongoose.entity";
import { Model } from "mongoose";

export class SessionRepository {
   constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) { }

   async createSession(newSession: Session): Promise<SessionDocument> {
      return await this.sessionModel.create(newSession)
   }

   async findSessionById(
      sessionId: string
   ): Promise<SessionDocument | null> {
      const session = await this.sessionModel.findById(sessionId);
      if (!session) {
         return null;
      }
      return session;
   }

   async deleteSessionById(sessionId: string): Promise<boolean> {
      const res = await this.sessionModel.deleteOne({ _id: sessionId })
      if (res.deletedCount === 0) {
         return false
      }
      return true
   }

   async deleteSessionsExcludeId(sessionId: string, userId: string): Promise<boolean> {
      const res = await this.sessionModel.deleteMany({
         userId: userId,
         _id: { $ne: sessionId }, // Исключаем текущую сессию из удаления
      });
      return !!res.deletedCount;

   }

}