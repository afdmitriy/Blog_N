import { Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Inject, Param, UseGuards } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { JwtCookieGuard } from "../../../infrastructure/guards/jwt-cookie.guard";
import { CurrentUserId } from "../../../infrastructure/decorators/transform/current-user-id.param.decorator";
import { ResultStatus } from "../../../base/models/enums/enums";
import { DeviceDeleteCommand } from "../application/delete.device.use-case";
import { RefreshCookieInputModel } from "./models/input/refresh.cookie.model";
import { DevicesDeleteCommand } from "../application/delete.devices.use-case";
import { SessionQueryRepository } from "../infrastructure/session.typeOrm.query.repository";
import { SessionOutputModel } from "./models/output/session.output.model";

@Controller('security')
export class SecurityController {
   constructor(private readonly commandBus: CommandBus,
      private readonly queryBus: QueryBus,
      @Inject(SessionQueryRepository.name) private readonly sessionQueryRepository: SessionQueryRepository,
   ) { }

   @Get('devices')
   @UseGuards(JwtCookieGuard)
   @HttpCode(200)
   async getDevices(@CurrentUserId() cookie: RefreshCookieInputModel): Promise<SessionOutputModel[]> {
      const devices = await this.sessionQueryRepository.getSessionsByUserId(cookie.userId)
      if (!devices) return []
      return devices
      // const result = await this.queryBus.execute(new GetDevicesQuery(cookie.userId));
      // if (result.status === ResultStatus.NOT_FOUND) throw new HttpException(`User not found`, HttpStatus.NOT_FOUND)
      // if (result.status === ResultStatus.SUCCESS) return result.data
      // throw new HttpException(`Something went wrong`, HttpStatus.INTERNAL_SERVER_ERROR)
   }

   @Delete('devices')
   @UseGuards(JwtCookieGuard)
   @HttpCode(204)
   async deleteDevice(@CurrentUserId() cookie: RefreshCookieInputModel): Promise<void> {
      const result = await this.commandBus.execute(new DevicesDeleteCommand(cookie.deviceId, cookie.userId))
      if (result.status === ResultStatus.NOT_FOUND) throw new HttpException(`User or session not found`, HttpStatus.NOT_FOUND)
      if (result.status === ResultStatus.SUCCESS) return
      throw new HttpException(`Something went wrong`, HttpStatus.INTERNAL_SERVER_ERROR)
   }
   @Delete('devices/:deviceId')
   @UseGuards(JwtCookieGuard)
   @HttpCode(204)
   async deleteDeviceById(@CurrentUserId() cookie: RefreshCookieInputModel, @Param('deviceId') deviceId: string): Promise<void> {
      console.log('deviceId', deviceId, deviceId.toString())
      const result = await this.commandBus.execute(new DeviceDeleteCommand(cookie.userId, deviceId))
      if (result.status === ResultStatus.FORBIDDEN) throw new HttpException(`Forbidden`, HttpStatus.FORBIDDEN)
      if (result.status === ResultStatus.NOT_FOUND) throw new HttpException(`session not found`, HttpStatus.NOT_FOUND)
      if (result.status === ResultStatus.SUCCESS) return
      throw new HttpException(`Something went wrong`, HttpStatus.INTERNAL_SERVER_ERROR)
   }
}