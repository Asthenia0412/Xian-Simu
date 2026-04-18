import { FastifyPluginAsync } from 'fastify';
import { cultivationService } from '../services/cultivationService.js';

export const cultivationRoutes: FastifyPluginAsync = async (app) => {
  // 开始修炼
  app.post('/cultivation/start', async (request, reply) => {
    const data = await cultivationService.startCultivation();
    return { code: 0, message: 'ok', data };
  });

  // 停止修炼
  app.post('/cultivation/stop', async (request, reply) => {
    const data = await cultivationService.stopCultivation();
    return { code: 0, message: 'ok', data };
  });

  // 获取修炼状态
  app.get('/cultivation/status', async (request, reply) => {
    const data = await cultivationService.getCultivationStatus();
    return { code: 0, message: 'ok', data };
  });

  // 请求修炼结算
  app.post('/cultivation/tick', async (request, reply) => {
    const data = await cultivationService.tick();
    return { code: 0, message: 'ok', data };
  });
};
