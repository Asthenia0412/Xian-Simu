const BASE_URL = '/api/v1';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {};
  // 只在有 body 时设置 Content-Type，避免 Fastify 拒绝空 JSON body
  if (options?.body) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: { ...headers, ...(options?.headers as Record<string, string>) },
  });
  const json = await res.json();
  if (json.code !== 0) {
    throw new Error(json.message);
  }
  return json.data as T;
}

export const api = {
  // Game
  createGame: () => request('/game/new', { method: 'POST' }),
  loadGame: (saveId: string) => request(`/game/load/${saveId}`),
  saveGame: (data: unknown) => request('/game/save', { method: 'POST', body: JSON.stringify(data) }),
  getSaves: () => request('/game/saves'),
  deleteSave: (saveId: string) => request(`/game/save/${saveId}`, { method: 'DELETE' }),

  // Character
  getCharacter: () => request('/character'),
  setCharacterName: (name: string) => request('/character/name', { method: 'POST', body: JSON.stringify({ name }) }),

  // Cultivation
  startCultivation: (techniqueId?: string) => request('/cultivation/start', { method: 'POST', body: JSON.stringify({ techniqueId }) }),
  stopCultivation: () => request('/cultivation/stop', { method: 'POST' }),
  getCultivationStatus: () => request('/cultivation/status'),
  cultivationTick: () => request('/cultivation/tick', { method: 'POST' }),

  // Breakthrough
  attemptBreakthrough: () => request('/breakthrough/attempt', { method: 'POST' }),
  getBreakthroughInfo: () => request('/breakthrough/info'),

  // Battle
  getMonsters: () => request('/battle/monsters'),
  startBattle: (monsterId: string) => request('/battle/start', { method: 'POST', body: JSON.stringify({ monsterId }) }),
  getBattleResult: (battleId: string) => request(`/battle/result/${battleId}`),

  // Inventory
  getInventory: () => request('/inventory'),
  useItem: (itemId: string) => request('/inventory/use', { method: 'POST', body: JSON.stringify({ itemId }) }),
  discardItem: (itemId: string, quantity: number) => request('/inventory/discard', { method: 'POST', body: JSON.stringify({ itemId, quantity }) }),

  // Shop
  getShopItems: () => request('/shop/items'),
  buyItem: (itemId: string, quantity: number) => request('/shop/buy', { method: 'POST', body: JSON.stringify({ itemId, quantity }) }),

  // Techniques
  getTechniques: () => request('/techniques'),
  getLearnedTechniques: () => request('/techniques/learned'),
  learnTechnique: (techniqueId: string) => request('/techniques/learn', { method: 'POST', body: JSON.stringify({ techniqueId }) }),
  activateTechnique: (techniqueId: string) => request('/techniques/activate', { method: 'POST', body: JSON.stringify({ techniqueId }) }),

  // Logs
  getLogs: () => request('/logs'),
  getLogsByType: (type: string) => request(`/logs/${type}`),
};
