import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { SecurityController } from "./api/security.controller";
import { DeviceDeleteUseCase } from "./application/delete.device.use-case";
import { DevicesDeleteUseCase } from "./application/delete.devices.use-case";
import { CqrsModule } from "@nestjs/cqrs";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Session_Orm } from "./domain/session.typeOrm.entity";
import { SessionRepository } from "./infrastructure/session.typeOrm.repository";
import { SessionQueryRepository } from "./infrastructure/session.typeOrm.query.repository";

@Module({
   imports: [CqrsModule, UsersModule,
      // MongooseModule.forFeature([{ name: Session.name, schema: SessionShema }]),
      TypeOrmModule.forFeature([Session_Orm]),
   ],
   controllers: [SecurityController],
   providers: [{
      provide: SessionRepository.name,
      useClass: SessionRepository
   },
   {
      provide: SessionQueryRepository.name,
      useClass: SessionQueryRepository
   },
   DeviceDeleteUseCase, DevicesDeleteUseCase
   ],
   exports: [SessionRepository.name, DeviceDeleteUseCase]
})
export class SessionsModule {
}