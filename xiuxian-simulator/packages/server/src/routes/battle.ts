import { FastifyPluginAsync } from 'fastify';
import { battleService } from '../services/battleService.js';

export const battleRoutes: FastifyPluginAsync = async (app) => {
  // 获取可挑战怪物列表
  app.get('/battle/monsters', async (request, reply) => {
    const data = await battleService.getMonsterList();
    return { code: 0, message: 'ok', data };
  });

  // 开始战斗
  app.post<{ Body: { monsterId: string } }>('/battle/start', async (request, reply) => {
    const { monsterId } = request.body;
    const data = await battleService.startBattle(monsterId);
    return { code: 0, message: 'ok', data };
  });

  // 获取战斗结果
  app.get<{ Params: { battleId: string } }>('/battle/result/:battleId', async (request, reply) => {
    const { battleId } = request.params;
    const data = await battleService.getBattleResult(battleId);
    return { code: 0, message: 'ok', data };
  });
};
