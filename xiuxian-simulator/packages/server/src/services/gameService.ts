export const gameService = {
  async createNewGame() {
    return {
      saveId: 'save_001',
      message: '新游戏已创建',
      createdAt: new Date().toISOString(),
    };
  },

  async loadSave(saveId: string) {
    return {
      saveId,
      character: {
        name: '无名修士',
        realm: '练气期一层',
        cultivation: 0,
        hp: 100,
        maxHp: 100,
        attack: 10,
        defense: 5,
      },
      savedAt: '2025-01-01T12:00:00Z',
    };
  },

  async saveGame() {
    return {
      saveId: 'save_001',
      message: '游戏已保存',
      savedAt: new Date().toISOString(),
    };
  },

  async getSaveList() {
    return {
      saves: [
        { saveId: 'save_001', name: '无名修士', realm: '练气期三层', savedAt: '2025-01-01T12:00:00Z' },
        { saveId: 'save_002', name: '剑仙', realm: '筑基期一层', savedAt: '2025-01-02T08:00:00Z' },
      ],
    };
  },

  async deleteSave(saveId: string) {
    return {
      saveId,
      message: '存档已删除',
    };
  },
};
