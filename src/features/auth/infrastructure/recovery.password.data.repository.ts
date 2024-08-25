import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PasswordResetData } from "../domain/recovery.password.data.entity";
import { Repository } from "typeorm";

@Injectable()
export class RecoveryPasswordDataRepository {
   constructor(@InjectRepository(PasswordResetData) protected sessionRepository: Repository<PasswordResetData>) { }

   async getByRecoveryCode(code: string): Promise<PasswordResetData | null> {
      const data = await this.sessionRepository.findOne({ where: { recoveryCode: code } });
      return data || null;
   }

   async save(data: PasswordResetData): Promise<PasswordResetData> {
      return this.sessionRepository.save(data)
   }
}