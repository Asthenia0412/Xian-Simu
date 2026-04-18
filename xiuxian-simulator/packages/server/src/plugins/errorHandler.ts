import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export function errorHandler(
  error: FastifyError | ZodError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error);

  if (error instanceof ZodError) {
    return reply.status(400).send({
      code: 400,
      message: '参数校验失败',
      data: error.errors,
    });
  }

  const statusCode = 'statusCode' in error ? (error as FastifyError).statusCode : 500;
  return reply.status(statusCode).send({
    code: statusCode,
    message: error.message ?? '服务器内部错误',
    data: null,
  });
}
