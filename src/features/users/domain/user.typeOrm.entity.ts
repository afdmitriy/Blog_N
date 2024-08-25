import { Column, Entity, OneToMany } from "typeorm";
import { BaseTypeORMEntity } from "../../../base/entities/base.entity";
import { UserCreateModel } from "../api/models/input/user.input";
import { Session_Orm } from "../../security/domain/session.typeOrm.entity";
import { PasswordResetData } from "../../auth/domain/recovery.password.data.entity";
// import { Session_Orm } from "../../security/domain/session.typeOrm.entity";

@Entity()
export class User_Orm extends BaseTypeORMEntity {
   @Column({collation: 'C'})
   login: string;

   @Column()
   email: string;

   @Column()
   passwordHash: string;

   @Column({ nullable: true })
   confirmationCode: string

   @Column({ nullable: true, type: 'timestamp with time zone' })
   codeExpirationDate: Date

   @Column({ default: false })
   isConfirmed: boolean;

   @OneToMany(() => Session_Orm, (s) => s.user)
   sessions: Session_Orm[];

   @OneToMany(() => PasswordResetData, (p) => p.user)
   passRecData: PasswordResetData[];

   // @OneToMany(() => Comment_Orm, (c) => c.userId)
   // comments: Comment_Orm[];

   // @OneToMany(() => Comment_like_Orm, (cl) => cl.userId)
   // commentLikes: Comment_like_Orm[];

   // @OneToMany(() => Post_like_Orm, (pl) => pl.userId)
   // postLikes: Post_like_Orm[];

   static createUserModel(userData: UserCreateModel): User_Orm {
      const user = new User_Orm();
      user.login = userData.login;
      user.email = userData.email;
      user.passwordHash = userData.passwordHash;
    
      return user;
   }

   addConfirmData(confirmCode: string, expirationDate: Date) {
      this.confirmationCode = confirmCode;
      this.codeExpirationDate = expirationDate;
   }

   confirmEmail() {
      this.isConfirmed = true
   }

   updatePassword(passwordHash: string) {
      this.passwordHash = passwordHash
   }

}