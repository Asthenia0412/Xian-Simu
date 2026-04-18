import { FastifyPluginAsync } from 'fastify';
import { gameService } from '../services/gameService.js';

export const gameRoutes: FastifyPluginAsync = async (app) => {
  // 创建新游戏
  app.post('/game/new', async (request, reply) => {
    const data = await gameService.createNewGame();
    return { code: 0, message: 'ok', data };
  });

  // 加载存档
  app.get<{ Params: { saveId: string } }>('/game/load/:saveId', async (request, reply) => {
    const { saveId } = request.params;
    const data = await gameService.loadSave(saveId);
    return { code: 0, message: 'ok', data };
  });

  // 保存游戏
  app.post('/game/save', async (request, reply) => {
    const data = await gameService.saveGame();
    return { code: 0, message: 'ok', data };
  });

  // 获取存档列表
  app.get('/game/saves', async (request, reply) => {
    const data = await gameService.getSaveList();
    return { code: 0, message: 'ok', data };
  });

  // 删除存档
  app.delete<{ Params: { saveId: string } }>('/game/save/:saveId', async (request, reply) => {
    const { saveId } = request.params;
    const data = await gameService.deleteSave(saveId);
    return { code: 0, message: 'ok', data };
  });
};
