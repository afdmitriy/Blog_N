import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { jwtConstants } from "../../../infrastructure/constants/constants";
import { add } from "date-fns";

@Schema()
export class Session {

	_id: Types.ObjectId;

   @Prop({ required: true })
   userId: string

	@Prop({ required: true })
	deviceName: string;

	@Prop({ required: true })
	ip: string;

	@Prop({ required: true })
	issuedAt: string;

	@Prop({ required: true })
	expirationDate: string;

   static createSession(userId: string, ip?: string, deviceName?: string) {
      const session = new this()
		const duration = parseInt(jwtConstants.refreshExpiresIn.slice(0, -1));
      session.userId = userId
      session.deviceName = deviceName ?? 'Unknown'
      session.ip = ip || 'Unknown'
      session.issuedAt = new Date().toISOString()
      session.expirationDate = add(new Date(), {
				days: duration
			}).toISOString()
		return session
	}

	extendSession() {
		const duration = parseInt(jwtConstants.refreshExpiresIn.slice(0, -1));
		this.issuedAt = new Date().toISOString()
		this.expirationDate = add(new Date(), {
			days: duration
		}).toISOString()
	}

}
export const SessionShema = SchemaFactory.createForClass(Session)
export type SessionDocument = HydratedDocument<Session>;
SessionShema.loadClass(Session); 