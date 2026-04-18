import { FastifyPluginAsync } from 'fastify';

export const shopRoutes: FastifyPluginAsync = async (app) => {
  // 获取商店物品
  app.get('/shop/items', async (request, reply) => {
    // TODO: 调用 shopService
    const data = {
      items: [
        { itemId: 'shop_001', name: '回血丹', price: 50, type: 'consumable', description: '恢复100点生命值' },
        { itemId: 'shop_002', name: '聚灵丹', price: 200, type: 'consumable', description: '增加500点修为' },
        { itemId: 'shop_003', name: '铁剑', price: 500, type: 'equipment', description: '攻击力+10' },
        { itemId: 'shop_004', name: '木剑', price: 100, type: 'equipment', description: '攻击力+5' },
      ],
    };
    return { code: 0, message: 'ok', data };
  });

  // 购买物品
  app.post<{ Body: { itemId: string; quantity?: number } }>('/shop/buy', async (request, reply) => {
    const { itemId, quantity = 1 } = request.body;
    // TODO: 调用 shopService
    const data = { itemId, quantity, cost: 50 * quantity, result: '购买成功' };
    return { code: 0, message: 'ok', data };
  });
};
