import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
   catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp(); //говорим серваку переключится в http (host.switchToHttp()), он возвращает контекст
      const response = ctx.getResponse<Response>(); //у контекста мы берем res
      const request = ctx.getRequest<Request>(); //у контекста мы берем req
      const status = exception.getStatus(); //к нам приходит exception error, получаем status

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