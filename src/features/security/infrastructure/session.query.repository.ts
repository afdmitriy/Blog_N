import { InjectModel } from "@nestjs/mongoose";
import { Session, SessionDocument } from "../domain/session.mongoose.entity";
import { Model } from "mongoose";

export class SessionQueryRepository {
   constructor(@InjectModel(Session.name) private sessionModel: Model<SessionDocument>) { }
   async getSessionsByUserId(userId: string) {
      const sessions = await this.sessionModel
         .find({ userId: userId}).lean()
         .exec();
      if (!sessions) return null;
      const updatedSessions = sessions.map((session) => {
         return {
            ...session,
            _id: session._id.toString(),
         };
      });
      return updatedSessions;
   }
}