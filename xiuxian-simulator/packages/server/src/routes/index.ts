import { FastifyPluginAsync } from 'fastify';
import { gameRoutes } from './game.js';
import { characterRoutes } from './character.js';
import { cultivationRoutes } from './cultivation.js';
import { breakthroughRoutes } from './breakthrough.js';
import { battleRoutes } from './battle.js';
import { inventoryRoutes } from './inventory.js';
import { shopRoutes } from './shop.js';
import { techniqueRoutes } from './techniques.js';
import { logRoutes } from './logs.js';

export const registerRoutes: FastifyPluginAsync = async (app) => {
  await app.register(gameRoutes);
  await app.register(characterRoutes);
  await app.register(cultivationRoutes);
  await app.register(breakthroughRoutes);
  await app.register(battleRoutes);
  await app.register(inventoryRoutes);
  await app.register(shopRoutes);
  await app.register(techniqueRoutes);
  await app.register(logRoutes);
};
