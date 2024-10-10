import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseTypeORMEntity } from "../../../../base/entities/base.entity";
import { User_Orm } from "../../../users/domain/user.typeOrm.entity";
import { Answer_Orm } from "./answer.entity";

@Entity()
export class Player_Orm extends BaseTypeORMEntity {

   @Column({type: 'int', default: 0})
   score: number;

   @Column({ type: 'uuid' })
   userId: string

   @ManyToOne(() => User_Orm, (u) => u.players, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'userId' })
   user: User_Orm;
   
   @OneToMany(() => Answer_Orm, (a) => a.playerId)
   answers: Answer_Orm[];

   static createPlayer(userId: string): Player_Orm {
      const player = new this();
      player.userId = userId

      return player;
   }

}
