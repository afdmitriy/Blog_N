import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BaseTypeORMEntity } from "../../../../base/entities/base.entity";
import { User_Orm } from "../../../users/domain/user.typeOrm.entity";
import { Answer } from "./answer.entity";

@Entity()
export class Player extends BaseTypeORMEntity {

   @Column({type: 'int', default: 0})
   score: number;

   @Column({ type: 'uuid' })
   userId: string

   @ManyToOne(() => User_Orm, (u) => u.players, { onDelete: "CASCADE" })
   @JoinColumn({ name: 'userId' })
   user: User_Orm;
   
   @OneToMany(() => Answer, (a) => a.playerId)
   answers: Answer[];

}
