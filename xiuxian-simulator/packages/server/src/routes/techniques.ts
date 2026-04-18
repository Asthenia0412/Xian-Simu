import { FastifyPluginAsync } from 'fastify';

export const techniqueRoutes: FastifyPluginAsync = async (app) => {
  // 获取所有功法
  app.get('/techniques', async (request, reply) => {
    // TODO: 调用 techniqueService
    const data = {
      techniques: [
        { techniqueId: 'tech_001', name: '吐纳术', realm: '练气期', multiplier: 1.0, description: '最基础的修炼功法' },
        { techniqueId: 'tech_002', name: '紫气东来功', realm: '筑基期', multiplier: 1.5, description: '引天地紫气入体，修炼速度大幅提升' },
        { techniqueId: 'tech_003', name: '太上感应篇', realm: '金丹期', multiplier: 2.0, description: '感应天地大道，修炼效率翻倍' },
      ],
    };
    return { code: 0, message: 'ok', data };
  });

  // 获取已学功法
  app.get('/techniques/learned', async (request, reply) => {
    // TODO: 调用 techniqueService
    const data = {
      techniques: [
        { techniqueId: 'tech_001', name: '吐纳术', level: 3, active: true },
      ],
    };
    return { code: 0, message: 'ok', data };
  });

  // 学习功法
  app.post<{ Body: { techniqueId: string } }>('/techniques/learn', async (request, reply) => {
    const { techniqueId } = request.body;
    // TODO: 调用 techniqueService
    const data = { techniqueId, result: '学习成功' };
    return { code: 0, message: 'ok', data };
  });

  // 切换当前功法
  app.post<{ Body: { techniqueId: string } }>('/techniques/activate', async (request, reply) => {
    const { techniqueId } = request.body;
    // TODO: 调用 techniqueService
    const data = { techniqueId, result: '已切换功法' };
    return { code: 0, message: 'ok', data };
  });
};
