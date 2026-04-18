export const cultivationService = {
  async startCultivation() {
    return {
      isCultivating: true,
      startedAt: new Date().toISOString(),
      technique: '吐纳术',
      multiplier: 1.0,
    };
  },

  async stopCultivation() {
    return {
      isCultivating: false,
      stoppedAt: new Date().toISOString(),
      totalCultivationGained: 120,
    };
  },

  async getCultivationStatus() {
    return {
      isCultivating: true,
      startedAt: '2025-01-01T10:00:00Z',
      elapsedSeconds: 300,
      technique: '吐纳术',
      multiplier: 1.0,
      cultivationPerTick: 10,
    };
  },

  async tick() {
    return {
      cultivationGained: 10,
      totalCultivation: 2510,
      maxCultivation: 5000,
      events: [],
    };
  },
};
