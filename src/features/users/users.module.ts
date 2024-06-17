import { Module } from "@nestjs/common";
import { UserController } from "./api/users.controller";
import { UserService } from "./application/user.service";
import { UserRepository } from "./infrastructure/user.repository";
import { UserQueryRepository } from "./infrastructure/user.query.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./domain/user.mongoose.entity";

@Module({
   imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
   controllers: [UserController],
   providers: [UserService, UserRepository, UserQueryRepository,
   ],
   exports:[UserService, UserRepository]
})
export class UsersModule {
}