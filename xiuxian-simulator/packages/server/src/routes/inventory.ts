import { FastifyPluginAsync } from 'fastify';

export const inventoryRoutes: FastifyPluginAsync = async (app) => {
  // 获取背包
  app.get('/inventory', async (request, reply) => {
    // TODO: 调用 inventoryService
    const data = {
      items: [
        { itemId: 'item_001', name: '回血丹', quantity: 5, type: 'consumable' },
        { itemId: 'item_002', name: '铁剑', quantity: 1, type: 'equipment' },
        { itemId: 'item_003', name: '灵石', quantity: 100, type: 'material' },
      ],
      capacity: 50,
      used: 3,
    };
    return { code: 0, message: 'ok', data };
  });

  // 使用物品
  app.post<{ Body: { itemId: string; quantity?: number } }>('/inventory/use', async (request, reply) => {
    const { itemId, quantity = 1 } = request.body;
    // TODO: 调用 inventoryService
    const data = { itemId, quantity, result: '使用成功' };
    return { code: 0, message: 'ok', data };
  });

  // 丢弃物品
  app.post<{ Body: { itemId: string; quantity: number } }>('/inventory/discard', async (request, reply) => {
    const { itemId, quantity } = request.body;
    // TODO: 调用 inventoryService
    const data = { itemId, quantity, result: '丢弃成功' };
    return { code: 0, message: 'ok', data };
  });
};
