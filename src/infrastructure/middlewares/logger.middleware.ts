// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { NextFunction, Request, Response } from 'express';
// import { ApiLogRepository } from '../../features/api.logger/api.logger.repository';
// import { ApiLogInputModel } from '../../features/api.logger/api.logger.model';



// @Injectable()
// export class LoggerMiddleware implements NestMiddleware {
//    constructor(protected apiLogRepository: ApiLogRepository) {}
   
//    async use(req: Request, res: Response, next: NextFunction) {
//       const ip = req.ip;
//       const url = req.originalUrl;
//       const date = new Date().toISOString();
//       if (ip && url) {
//          const log: ApiLogInputModel = {
//             ip: ip,
//             url: url,
//             createdAt: date,
//          };
//          await this.apiLogRepository.create(log)
//       }

//       next();
//    }
// }
