export const characterService = {
  async getCharacterInfo() {
    return {
      id: 'char_001',
      name: '无名修士',
      realm: '练气期三层',
      cultivation: 2500,
      maxCultivation: 5000,
      hp: 150,
      maxHp: 150,
      attack: 15,
      defense: 8,
      spirit: 10,
      luck: 5,
      gold: 500,
    };
  },

  async setCharacterName(name: string) {
    return {
      name,
      message: '角色名称已更新',
    };
  },
};
