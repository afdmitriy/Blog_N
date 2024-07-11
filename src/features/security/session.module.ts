import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { SecurityController } from "./api/security.controller";
import { SessionRepository } from "./infrastructure/session.repository";
import { SessionQueryRepository } from "./infrastructure/session.query.repository";
import { DeviceDeleteUseCase } from "./application/delete.device.use-case";
import { DevicesDeleteUseCase } from "./application/delete.devices.use-case";
import { GetDevicesUseCase } from "./application/get.devices.use-case";
import { MongooseModule } from "@nestjs/mongoose";
import { Session, SessionShema } from "./domain/session.mongoose.entity";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
   imports: [CqrsModule, UsersModule,
      MongooseModule.forFeature([{ name: Session.name, schema: SessionShema }])
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
   DeviceDeleteUseCase, DevicesDeleteUseCase, GetDevicesUseCase
   ],
   exports: [SessionRepository.name, DeviceDeleteUseCase]
})
export class SessionsModule {
}