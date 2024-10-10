import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
   catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.getStatus();

      if (status === HttpStatus.BAD_REQUEST) {
         const errorsResponse: { errorsMessages: any[] } = {
            errorsMessages: [],
         };

         const responseBody: any = exception.getResponse();

         if (Array.isArray(responseBody.message)) {
            responseBody.message.forEach((m) => errorsResponse.errorsMessages.push(m));
         } else {
            errorsResponse.errorsMessages.push(responseBody.message);
         }

         response.status(status).json(errorsResponse);
      } else {
         response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
         });
      }
   }
}