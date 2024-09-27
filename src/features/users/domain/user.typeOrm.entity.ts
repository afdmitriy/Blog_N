import { Column, Entity, OneToMany } from "typeorm";
import { BaseTypeORMEntity } from "../../../base/entities/base.entity";
import { UserCreateModel } from "../api/models/input/user.input";
import { Session_Orm } from "../../security/domain/session.typeOrm.entity";
import { PasswordResetData } from "../../auth/domain/recovery.password.data.entity";
import { LikeForPost_Orm } from "../../posts/domain/like-for-post.typeOrm.entity";
import { Comment_Orm } from "../../comments/domain/comment.typeOrm.entity";
import { LikeForComment_Orm } from "../../comments/domain/like-for-comment.typeOrm.entity";
import { Player } from "../../quiz/domain/entities/player.entity";
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

   @OneToMany(() => LikeForPost_Orm, (pl) => pl.user)
   postLikes: LikeForPost_Orm[];

   @OneToMany(() => Comment_Orm, (c) => c.userId)
   comments: Comment_Orm[];

   @OneToMany(() => LikeForComment_Orm, (cl) => cl.userId)
   commentLikes: LikeForComment_Orm[];

   @OneToMany(() => Player, (player) => player.userId)
   players: Player[];

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