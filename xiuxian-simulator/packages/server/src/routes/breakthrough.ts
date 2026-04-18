import { FastifyPluginAsync } from 'fastify';

export const breakthroughRoutes: FastifyPluginAsync = async (app) => {
  // 尝试突破
  app.post('/breakthrough/attempt', async (request, reply) => {
    // TODO: 调用 breakthroughService
    const data = {
      success: true,
      newRealm: '筑基期',
      message: '突破成功！修为更上一层楼。',
    };
    return { code: 0, message: 'ok', data };
  });

  // 获取突破信息
  app.get('/breakthrough/info', async (request, reply) => {
    // TODO: 调用 breakthroughService
    const data = {
      currentRealm: '练气期九层',
      nextRealm: '筑基期',
      requiredCultivation: 10000,
      currentCultivation: 8500,
      successRate: 0.75,
    };
    return { code: 0, message: 'ok', data };
  });
};
