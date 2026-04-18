export const battleService = {
  async getMonsterList() {
    return {
      monsters: [
        { monsterId: 'monster_001', name: '野狼', level: 1, hp: 50, attack: 8, defense: 3, expReward: 20, goldReward: 10 },
        { monsterId: 'monster_002', name: '毒蛇', level: 2, hp: 80, attack: 12, defense: 5, expReward: 35, goldReward: 15 },
        { monsterId: 'monster_003', name: '山贼', level: 3, hp: 120, attack: 18, defense: 8, expReward: 60, goldReward: 30 },
        { monsterId: 'monster_004', name: '妖狐', level: 5, hp: 200, attack: 25, defense: 12, expReward: 100, goldReward: 50 },
      ],
    };
  },

  async startBattle(monsterId: string) {
    return {
      battleId: 'battle_001',
      monsterId,
      monsterName: '野狼',
      status: 'victory',
      rounds: 3,
      rewards: {
        exp: 20,
        gold: 10,
        items: [{ itemId: 'item_001', name: '狼皮', quantity: 1 }],
      },
      hpRemaining: 130,
    };
  },

  async getBattleResult(battleId: string) {
    return {
      battleId,
      monsterName: '野狼',
      status: 'victory',
      rounds: [
        { round: 1, action: '攻击', damage: 15, monsterHp: 35 },
        { round: 2, action: '攻击', damage: 12, monsterHp: 23 },
        { round: 3, action: '攻击', damage: 23, monsterHp: 0 },
      ],
      rewards: {
        exp: 20,
        gold: 10,
        items: [{ itemId: 'item_001', name: '狼皮', quantity: 1 }],
      },
    };
  },
};
