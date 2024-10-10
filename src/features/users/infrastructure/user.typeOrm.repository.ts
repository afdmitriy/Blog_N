import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User_Orm } from "../domain/user.typeOrm.entity";

@Injectable()
export class UserRepository {
   constructor(@InjectRepository(User_Orm) protected userRepository: Repository<User_Orm>) { }

   async getById(id: string): Promise<User_Orm | null> {
      const user = await this.userRepository.findOne({ where: { id } });
      return user || null;
   }

   async getByLoginOrEmail(loginOrEmail: string): Promise<User_Orm | null> {
      const user = await this.userRepository.findOne({
         where: [{ login: loginOrEmail }, { email: loginOrEmail }],
      });
      return user || null;
   }

   async getByConfirmationCode(code: string): Promise<User_Orm | null> {
      const user = await this.userRepository.findOne({ where: { confirmationCode: code } });
      return user || null;
   }

   async deleteById(id: string): Promise<void> {
      await this.userRepository.softDelete(id)
   }

   async save(user: User_Orm): Promise<User_Orm> {
      return this.userRepository.save(user)
   }
}