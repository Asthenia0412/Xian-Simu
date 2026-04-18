import { FastifyPluginAsync } from 'fastify';
import { characterService } from '../services/characterService.js';

export const characterRoutes: FastifyPluginAsync = async (app) => {
  // 获取角色信息
  app.get('/character', async (request, reply) => {
    const data = await characterService.getCharacterInfo();
    return { code: 0, message: 'ok', data };
  });

  // 设置角色名称
  app.post<{ Body: { name: string } }>('/character/name', async (request, reply) => {
    const { name } = request.body;
    const data = await characterService.setCharacterName(name);
    return { code: 0, message: 'ok', data };
  });
};
