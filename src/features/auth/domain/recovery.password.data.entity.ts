import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BaseTypeORMEntity } from "../../../base/entities/base.entity";
import { User_Orm } from "../../users/domain/user.typeOrm.entity";
import { PasswordResetDataCreateModel } from "../api/models/input/password.recovery.password.data.create.model";

@Entity()
export class PasswordResetData extends BaseTypeORMEntity {
   @Column()
	recoveryCode: string;

	@Column({type: 'timestamp with time zone' })
	expirationDate: Date

	@Column({ default: false })
	isConfirmed: boolean

   @Column()
   userId: string;

   @ManyToOne(() => User_Orm, (u) => u.sessions, {onDelete: "CASCADE"})
   @JoinColumn({ name: 'userId' })
   user: User_Orm;

   static createData(dataModel: PasswordResetDataCreateModel) {
      const data = new this()
      data.recoveryCode = dataModel.recoveryCode
      data.userId = dataModel.userId
      data.expirationDate = dataModel.expirationDate
		return data
	}

   confirm() {
      this.isConfirmed = true
   }
}