// import { Injectable } from "@nestjs/common";
// import { InjectDataSource } from "@nestjs/typeorm";
// import { DataSource } from "typeorm";
// import { EmailConfirmationData, PasswordResetData, User } from "../domain/user.mongoose.entity";

// @Injectable()
// export class UserSQLRepository {
//    constructor(@InjectDataSource() protected dataSource: DataSource) { }
//    async findUserByLoginOrEmail(loginOrEmail: string): Promise<User | null> {
//       const query = `
//          SELECT * 
//          FROM Users 
//          WHERE "email" = $1 OR "login" = $1 AND isActive = true;
//         `;
//       const user = await this.dataSource.query(query, [loginOrEmail]);
//       console.log(user)
//       return user.length !== 0 ? user[0] : null;
//    }

//    async createUser(newUser: User) {
//       const queryUsers = `
//        INSERT INTO "Users" ("login", "email", "createdAt", "passwordHash") 
//        VALUES ('${newUser.login}', '${newUser.email}', '${newUser.createdAt}', 
//               '${newUser.passwordHash}')
//         RETURNING "id"
//       `;
//       try {
//          const user = await this.dataSource.query(queryUsers);
//          return user[0];
//       } catch (error) {
//          console.error("Error deleting user:", error);
//          return false;
//       }
//    }

//    async getUserById(userId: string): Promise<User | null> {
//       const query = `
//          SELECT * 
//          FROM Users 
//          WHERE "id" = $1 AND isActive = true;
//         `;
//       const user = await this.dataSource.query(query, [userId]);
//       console.log(user)
//       return user.length !== 0 ? user[0] : null;
//    }

//    async deleteUserById(userId: string): Promise<boolean> {
//       const query = `
//       DELETE FROM Users
//       WHERE "id" = $1;
//     `;
//       try {
//          await this.dataSource.query(query, [userId]);
//          return true;
//       } catch (error) {
//          console.error("Error deleting user:", error);
//          return false;
//       }
//    }

//    async createConfirmCode(confirmCode: EmailConfirmationData): Promise<boolean> {

//    }

//    async createRecoveryCode(recoveryCode: PasswordResetData): Promise<boolean> {

//    }

//    async getUserByConfirmCode(confirmCode: string): Promise<User | null> {

//    }

//    async getUserByRecoveryCode(recoveryCode: string): Promise<User | null> {

//    }
// }