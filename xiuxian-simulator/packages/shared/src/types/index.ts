// ============================================
// 境界体系
// ============================================

export type RealmId =
  | 'mortal'
  | 'qi_refining_1'
  | 'qi_refining_2'
  | 'qi_refining_3'
  | 'qi_refining_4'
  | 'qi_refining_5'
  | 'qi_refining_6'
  | 'qi_refining_7'
  | 'qi_refining_8'
  | 'qi_refining_9'
  | 'foundation_1'
  | 'foundation_2'
  | 'foundation_3'
  | 'golden_core_1'
  | 'golden_core_2'
  | 'golden_core_3'
  | 'nascent_soul_1'
  | 'nascent_soul_2'
  | 'nascent_soul_3';

export interface RealmConfig {
  id: RealmId;
  name: string;
  stage: string;
  level: number;
  maxCultivation: number;
  breakthroughRate: number;
  statBonus: {
    hp: number;
    mp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  requiredItems?: string[];
}

// ============================================
// 角色属性
// ============================================

export type CharacterStatus = 'idle' | 'cultivating' | 'fighting' | 'breaking_through';

export interface Character {
  id: string;
  name: string;
  title: string;

  // 基础属性
  realm: RealmId;
  realmLevel: number;
  cultivation: number;
  maxCultivation: number;

  // 战斗属性
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  attack: number;
  defense: number;
  speed: number;

  // 资源
  gold: number;
  spiritStones: number;

  // 状态
  status: CharacterStatus;
  currentAction: string | null;

  // 时间
  createdAt: number;
  updatedAt: number;
  totalPlayTime: number;
}

// ============================================
// 功法
// ============================================

export type TechniqueGrade = 'mortal' | 'profound' | 'earth' | 'heaven';

export interface Technique {
  id: string;
  name: string;
  description: string;
  grade: TechniqueGrade;
  cultivationSpeedBonus: number;
  statBonus: Partial<{
    hp: number;
    mp: number;
    attack: number;
    defense: number;
    speed: number;
  }>;
  requiredRealm: RealmId;
  price: number;
}

// ============================================
// 丹药
// ============================================

export type PillGrade = 'common' | 'rare' | 'epic' | 'legendary';
export type PillEffectType =
  | 'cultivation'
  | 'hp'
  | 'mp'
  | 'attack'
  | 'defense'
  | 'speed'
  | 'breakthrough_rate';

export interface PillEffect {
  type: PillEffectType;
  value: number;
  duration?: number;
}

export interface Pill {
  id: string;
  name: string;
  description: string;
  grade: PillGrade;
  effects: PillEffect[];
  price: number;
}

// ============================================
// 怪物
// ============================================

export interface LootTable {
  itemId: string;
  chance: number;
  minCount: number;
  maxCount: number;
}

export interface Monster {
  id: string;
  name: string;
  description: string;
  realm: RealmId;
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  speed: number;
  loot: LootTable[];
  expReward: number;
  goldReward: [number, number];
}

// ============================================
// 背包
// ============================================

export type ItemSlotType = 'pill' | 'material' | 'equipment' | 'technique_scroll';

export interface InventorySlot {
  itemId: string;
  itemType: ItemSlotType;
  quantity: number;
}

export interface Inventory {
  slots: InventorySlot[];
  maxSlots: number;
  gold: number;
}

// ============================================
// 日志
// ============================================

export type LogType = 'cultivation' | 'battle' | 'breakthrough' | 'system' | 'trade';

export interface LogEntry {
  id: string;
  type: LogType;
  message: string;
  timestamp: number;
  details?: Record<string, unknown>;
}

// ============================================
// 存档
// ============================================

export interface SaveData {
  version: string;
  character: Character;
  inventory: Inventory;
  techniques: string[];
  activeTechnique: string;
  battleLog: LogEntry[];
  eventLog: LogEntry[];
  unlockedAreas: string[];
  saveTime: number;
}

// ============================================
// 战斗
// ============================================

export type BattleResult = 'win' | 'lose';

export interface BattleRound {
  round: number;
  attacker: 'player' | 'monster';
  damage: number;
  attackerHpAfter: number;
  defenderHpAfter: number;
}

export interface BattleReport {
  id: string;
  monsterId: string;
  monsterName: string;
  result: BattleResult;
  rounds: BattleRound[];
  rewards: {
    cultivation: number;
    gold: number;
    items: Array<{ itemId: string; quantity: number }>;
  };
  timestamp: number;
}

// ============================================
// API 通用
// ============================================

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
