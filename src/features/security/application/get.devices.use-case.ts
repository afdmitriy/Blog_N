// import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
// import { UserRepository } from "../../users/infrastructure/user.repository";
// import { ResultObjectModel } from "../../../base/models/result.object.type";
// import { SessionOutputModel } from "../api/models/output/session.output.model";
// import { ResultStatus } from "../../../base/models/enums/enums";
// import { Inject } from "@nestjs/common";
// import { SessionQueryRepository } from "../infrastructure/session.typeOrm.query.repository";

// export class GetDevicesQuery {
//    constructor(public userId: string) { }
// }

// @QueryHandler(GetDevicesQuery)
// export class GetDevicesUseCase implements IQueryHandler<GetDevicesQuery> {
//    constructor(
//       private readonly userRepository: UserRepository,
//       @Inject(SessionQueryRepository.name) private readonly sessionQueryRepository: SessionQueryRepository


//    ) { }
//    async execute(query: GetDevicesQuery): Promise<ResultObjectModel<SessionOutputModel[] | null>> {
//       // const user = await this.userRepository.getUserById(query.userId)
//       // if (!user) return {
//       //    data: null,
//       //    errorMessage: 'User not found',
//       //    status: ResultStatus.NOT_FOUND
//       // }
//       const sessions = await this.sessionQueryRepository.getSessionsByUserId(query.userId)
//       if (!sessions) return {
//          data: null,
//          errorMessage: 'Session not found',
//          status: ResultStatus.NOT_FOUND
//       }
//       const devices = sessions
//          .filter((device) => {
//             const isNotExpired = this.checkExpirationDate(device.expirationDate);
//             return isNotExpired;
//          })
//          .map((device) => {
//             return {
//                deviceId: device._id.toString(),
//                ip: device.ip,
//                lastActiveDate: device.issuedAt,
//                title: device.deviceName,
//             };
//          });
//       return {
//          data: devices,
//          status: ResultStatus.SUCCESS
//       }
//    }

//    checkExpirationDate(date: string): boolean {
//       const now = new Date();
//       const expirationDate = new Date(date);
//       return expirationDate > now;
//    }
// }