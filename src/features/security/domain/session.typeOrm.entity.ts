import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseTypeORMEntity } from "../../../base/entities/base.entity";
import { User_Orm } from "../../users/domain/user.typeOrm.entity";
import { jwtConstants } from "../../../infrastructure/constants/constants";
import { add } from "date-fns";
import { SessionCreateModel } from "../api/models/input/create.session.model";

@Entity()
export class Session_Orm extends BaseTypeORMEntity {
   @Column()
   userId: string;

   @Column()
   deviceName: string;

   @Column()
	ip: string;

   @Column({type: 'timestamp with time zone' })
   expirationDate: Date

   @ManyToOne(() => User_Orm, (u) => u.sessions, {onDelete: "CASCADE"})
   @JoinColumn({ name: 'userId' })
   user: User_Orm;

   static createSession(sessonModel: SessionCreateModel) {
      const session = new this()
      session.userId = sessonModel.userId
      session.deviceName = sessonModel.deviceName ?? 'Unknown'
      session.ip = sessonModel.ip || 'Unknown'
      session.expirationDate = sessonModel.expirationDate
		return session
	}

   extendSession() {
		const duration = parseInt(jwtConstants.refreshExpiresIn.slice(0, -1));
		this.expirationDate = add(new Date(), {
			days: duration
		})
	}
}