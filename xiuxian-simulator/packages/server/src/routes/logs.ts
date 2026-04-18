import { FastifyPluginAsync } from 'fastify';

export const logRoutes: FastifyPluginAsync = async (app) => {
  // 获取日志列表
  app.get('/logs', async (request, reply) => {
    // TODO: 调用 logService
    const data = {
      logs: [
        { id: 'log_001', type: 'cultivation', message: '修炼获得修为 +50', timestamp: '2025-01-01T10:00:00Z' },
        { id: 'log_002', type: 'battle', message: '击败野狼，获得经验 +20', timestamp: '2025-01-01T09:30:00Z' },
        { id: 'log_003', type: 'breakthrough', message: '突破至练气期二层', timestamp: '2025-01-01T08:00:00Z' },
        { id: 'log_004', type: 'item', message: '获得回血丹 x3', timestamp: '2025-01-01T07:00:00Z' },
      ],
    };
    return { code: 0, message: 'ok', data };
  });

  // 按类型获取日志
  app.get<{ Params: { type: string } }>('/logs/:type', async (request, reply) => {
    const { type } = request.params;
    // TODO: 调用 logService
    const data = {
      type,
      logs: [
        { id: 'log_001', type, message: `类型 ${type} 的日志条目1`, timestamp: '2025-01-01T10:00:00Z' },
        { id: 'log_002', type, message: `类型 ${type} 的日志条目2`, timestamp: '2025-01-01T09:00:00Z' },
      ],
    };
    return { code: 0, message: 'ok', data };
  });
};
