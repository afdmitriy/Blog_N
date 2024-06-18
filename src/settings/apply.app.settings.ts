import {
   BadRequestException,
   INestApplication,
   ValidationPipe,
 } from '@nestjs/common';
 import { AppModule } from '../app.module';
 import { useContainer } from 'class-validator';
import { HttpExceptionFilter } from '../infrastructure/exception-filters/http.exceptoin.filter';




 // Префикс нашего приложения (http://site.com/api)
//  const APP_PREFIX = '/api';
 
 // Используем данную функцию в main.ts и в e2e тестах
 export const applyAppSettings = (app: INestApplication) => {
   // Для внедрения зависимостей в validator constraint
   // {fallbackOnErrors: true} требуется, поскольку Nest генерирует исключение,
   // когда DI не имеет необходимого класса.
   useContainer(app.select(AppModule), { fallbackOnErrors: true });
 
   // Применение глобальных Interceptors
   // app.useGlobalInterceptors()
 
   // Применение глобальных Guards
   //  app.useGlobalGuards(new AuthGuard());
 
   // Применить middleware глобально
  //  app.use(LoggerMiddleware);
 
   // Установка префикса
 
 
   // Применение глобальных pipes
   setAppPipes(app);
 
   // Применение глобальных exceptions filters
   setAppExceptionsFilters(app);
 };
 
 

 
 const setAppPipes = (app: INestApplication) => {
   app.useGlobalPipes(
     new ValidationPipe({
       // Для работы трансформации входящих данных
       transform: true,
       // Выдавать первую ошибку для каждого поля
       stopAtFirstError: true,

      //  forbidUnknownValues: false,
       // Перехватываем ошибку, кастомизируем её и выкидываем 400 с собранными данными
       exceptionFactory: (errors) => {
         const customErrors = [];
 
         errors.forEach((e) => {
        /*   {
             isEmail: "Error email",
             isLength: "Error max length
           }
           */
 
           const constraintKeys = Object.keys(e.constraints as any);
 
           constraintKeys.forEach((cKey) => {
             const msg = e.constraints?.[cKey] as any;
 
             // @ts-expect-error !!!
             customErrors.push({ field: e.property, message: msg });
           });
         });
 
         // Error 400
         throw new BadRequestException(customErrors);
       },
     }),
   );
 };
 
 const setAppExceptionsFilters = (app: INestApplication) => {
   app.useGlobalFilters(new HttpExceptionFilter());
 };