import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  // именно user по доке
  return request.user ?? null;
});



//ДЕЛАЙ ДЕКОРАТОРЫ ЧОБЫ ОШИБКИ ВАЛИЛИС В НУЖНОМ ФОРМАТЕ