import { Module } from "@nestjs/common";
import { UserController } from "./api/users.controller";
import { UserService } from "./application/user.service";
import { UserQueryRepository } from "./infrastructure/user.typeOrm.query.repository";
import { UserRepository } from "./infrastructure/user.typeOrm.repository";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User_Orm } from "./domain/user.typeOrm.entity";
import { CqrsModule } from "@nestjs/cqrs";
import { UserCreateUseCase } from "./application/user.create.use-case";
import { UserDeleteUseCase } from "./application/user.delete.use-case";

@Module({
   imports: [CqrsModule,
      // MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
      TypeOrmModule.forFeature([User_Orm])],
   controllers: [UserController],
   providers: [
      {
         provide: UserRepository.name,
         useClass: UserRepository
      },
      {
         provide: UserQueryRepository.name,
         useClass: UserQueryRepository
      },
      UserService, UserCreateUseCase, UserDeleteUseCase
   ],
   exports: [UserService, UserRepository.name]
})
export class UsersModule {
}