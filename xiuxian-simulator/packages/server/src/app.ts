import Fastify from 'fastify';
import cors from '@fastify/cors';
import { config } from './config/index.js';
import { errorHandler } from './plugins/errorHandler.js';
import { registerRoutes } from './routes/index.js';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: config.logLevel,
      transport: config.isDev
        ? { target: 'pino-pretty', options: { colorize: true } }
        : undefined,
    },
  });

  // 插件
  await app.register(cors, { origin: config.corsOrigin });
  app.setErrorHandler(errorHandler);

  // 路由
  await app.register(registerRoutes, { prefix: '/api/v1' });

  return app;
}
