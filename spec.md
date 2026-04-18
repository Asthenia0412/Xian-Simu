# 修仙模拟器 MVP - 产品规格文档

> 版本: v0.3.0
> 更新时间: 2026-04-19
> 状态: 初稿，待逐步完善

---

## 1. 项目概述

### 1.1 项目定位
一款基于 Web 的单机修仙模拟器，玩家扮演一名修仙者，通过修炼、突破、战斗等方式不断变强，体验从凡人到仙人的修仙之路。

### 1.2 技术栈
| 层级 | 技术选型 | 说明 |
|------|---------|------|
| 前端 | React 18 + TypeScript | SPA 单页应用 |
| 后端 | Node.js + Fastify + TypeScript | RESTful API |
| 数据存储 | JSON 文件 (fs) | 单机本地存储，无需数据库 |
| 数据校验 | Zod | 请求参数校验 + JSON 存档校验 |
| 日志 | Pino | Fastify 内置高性能日志 |
| 构建工具 | Vite (前端) / tsx (后端) | 开发与构建 |
| 包管理 | pnpm | monorepo 管理 |

### 1.3 项目结构
```
xiuxian-simulator/
├── packages/
│   ├── client/                  # React 前端
│   │   ├── src/
│   │   │   ├── components/      # UI 组件
│   │   │   ├── pages/           # 页面
│   │   │   ├── hooks/           # 自定义 Hooks
│   │   │   ├── services/        # API 调用层
│   │   │   ├── store/           # 状态管理 (Zustand)
│   │   │   ├── types/           # 类型定义
│   │   │   └── utils/           # 工具函数
│   │   └── ...
│   ├── server/                  # Node.js 后端
│   │   ├── src/
│   │   │   ├── routes/          # 路由
│   │   │   ├── services/        # 业务逻辑
│   │   │   ├── models/          # 数据模型
│   │   │   ├── data/            # JSON 静态数据 (功法、丹药、境界等)
│   │   │   ├── save/            # 存档文件目录
│   │   │   ├── middleware/      # 中间件
│   │   │   ├── types/           # 类型定义
│   │   │   └── utils/           # 工具函数
│   │   └── ...
│   └── shared/                  # 前后端共享
│       ├── types/               # 共享类型定义
│       └── constants/           # 共享常量
├── pnpm-workspace.yaml
├── package.json
└── tsconfig.base.json
```

---

## 2. MVP 核心系统

### 2.1 系统总览

```
┌─────────────────────────────────────────────┐
│                 修仙模拟器 MVP                │
├──────────┬──────────┬───────────┬───────────┤
│  角色系统 │  修炼系统 │  战斗系统  │  资源系统  │
├──────────┼──────────┼───────────┼───────────┤
│  背包系统 │  突破系统 │  日志系统  │  存档系统  │
└──────────┴──────────┴───────────┴───────────┘
```

---

## 3. 数据模型

### 3.1 角色属性 (Character)

```typescript
interface Character {
  id: string;                    // 角色唯一 ID
  name: string;                  // 角色名
  title: string;                 // 称号 (如"练气期弟子")

  // === 基础属性 ===
  realm: RealmId;                // 当前境界
  realmLevel: number;            // 境界内小层级 (1-9)
  cultivation: number;           // 当前修为值
  maxCultivation: number;        // 当前境界突破所需修为

  // === 战斗属性 ===
  hp: number;                    // 当前生命值
  maxHp: number;                 // 最大生命值
  mp: number;                    // 当前灵力值
  maxMp: number;                 // 最大灵力值
  attack: number;                // 攻击力
  defense: number;               // 防御力
  speed: number;                 // 速度

  // === 资源 ===
  gold: number;                  // 灵石 (通用货币)
  spiritStones: number;          // 灵石碎片 (高级货币)

  // === 状态 ===
  status: CharacterStatus;       // 角色状态 (修炼中/空闲/战斗中/突破中)
  currentAction: string | null;  // 当前正在执行的动作

  // === 时间 ===
  createdAt: number;             // 创建时间戳
  updatedAt: number;             // 最后更新时间戳
  totalPlayTime: number;         // 总游戏时长 (秒)
}
```

### 3.2 境界体系 (Realm)

```typescript
type RealmId =
  | 'mortal'          // 凡人
  | 'qi_refining_1'   // 练气一层
  | 'qi_refining_2'   // 练气二层
  | 'qi_refining_3'   // 练气三层
  | 'qi_refining_4'   // 练气四层
  | 'qi_refining_5'   // 练气五层
  | 'qi_refining_6'   // 练气六层
  | 'qi_refining_7'   // 练气七层
  | 'qi_refining_8'   // 练气八层
  | 'qi_refining_9'   // 练气九层
  | 'foundation_1'    // 筑基一层
  | 'foundation_2'    // 筑基二层
  | 'foundation_3'    // 筑基三层
  | 'golden_core_1'   // 金丹初期
  | 'golden_core_2'   // 金丹中期
  | 'golden_core_3'   // 金丹后期
  | 'nascent_soul_1'  // 元婴初期
  | 'nascent_soul_2'  // 元婴中期
  | 'nascent_soul_3'  // 元婴后期;

interface RealmConfig {
  id: RealmId;
  name: string;                // 境界名称 (如"练气一层")
  stage: string;               // 大境界 (如"练气期")
  level: number;               // 层级序号
  maxCultivation: number;      // 突破所需修为
  breakthroughRate: number;    // 突破成功率 (0-1)
  statBonus: {                 // 突破后属性加成
    hp: number;
    mp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  requiredItems?: string[];    // 突破所需物品 (MVP 可选)
}
```

### 3.3 功法 (Technique)

```typescript
interface Technique {
  id: string;
  name: string;                // 功法名称 (如"吐纳术")
  description: string;         // 功法描述
  grade: 'mortal' | 'profound' | 'earth' | 'heaven';  // 品阶
  cultivationSpeedBonus: number;  // 修炼速度加成 (倍率)
  statBonus: Partial<{         // 被动属性加成
    hp: number;
    mp: number;
    attack: number;
    defense: number;
    speed: number;
  }>;
  requiredRealm: RealmId;      // 修炼所需最低境界
}
```

### 3.4 丹药 (Pill)

```typescript
interface Pill {
  id: string;
  name: string;                // 丹药名称 (如"聚气丹")
  description: string;
  grade: 'common' | 'rare' | 'epic' | 'legendary';
  effects: PillEffect[];       // 效果列表
  price: number;               // 购买价格 (灵石)
}

interface PillEffect {
  type: 'cultivation' | 'hp' | 'mp' | 'attack' | 'defense' | 'speed' | 'breakthrough_rate';
  value: number;               // 效果值
  duration?: number;           // 持续时间 (秒), undefined 表示永久
}
```

### 3.5 怪物 (Monster)

```typescript
interface Monster {
  id: string;
  name: string;                // 怪物名称 (如"灵兔")
  description: string;
  realm: RealmId;              // 怪物境界
  hp: number;
  mp: number;
  attack: number;
  defense: number;
  speed: number;
  loot: LootTable[];           // 掉落表
  expReward: number;           // 修为奖励
  goldReward: [number, number]; // 灵石奖励 [最小, 最大]
}

interface LootTable {
  itemId: string;
  chance: number;              // 掉落概率 (0-1)
  minCount: number;
  maxCount: number;
}
```

### 3.6 背包 (Inventory)

```typescript
interface InventorySlot {
  itemId: string;
  itemType: 'pill' | 'material' | 'equipment' | 'technique_scroll';
  quantity: number;
}

interface Inventory {
  slots: InventorySlot[];
  maxSlots: number;            // 背包容量上限
  gold: number;                // 灵石
}
```

### 3.7 存档 (SaveData)

```typescript
interface SaveData {
  version: string;             // 存档版本号
  character: Character;
  inventory: Inventory;
  techniques: string[];        // 已学会的功法 ID 列表
  activeTechnique: string;     // 当前修炼功法 ID
  battleLog: LogEntry[];       // 战斗日志
  eventLog: LogEntry[];        // 事件日志
  unlockedAreas: string[];     // 已解锁的区域
  saveTime: number;            // 存档时间戳
}
```

---

## 4. 核心系统设计

### 4.1 修炼系统

**核心机制**：玩家选择功法进行修炼，随时间积累修为，修为满后可尝试突破。

```
修炼流程:
1. 选择功法 → 2. 开始修炼 → 3. 挂机积累修为 → 4. 修为满 → 5. 尝试突破
```

**修炼速度计算**：
```
基础修炼速度 = 10 修为/秒
功法加成 = 基础速度 × 功法修炼速度倍率
实际速度 = 基础速度 + 功法加成
```

**后端实现要点**：
- 修炼为离线挂机模式：玩家关闭页面后，下次打开时根据离线时间计算修为增量
- 服务端维护一个 `lastTick` 时间戳，每次请求时计算时间差
- 修炼过程中可被打断（战斗、使用物品等）

### 4.2 突破系统

**核心机制**：修为达到当前境界上限后，可尝试突破到下一境界。

```
突破流程:
1. 修为满 → 2. 点击突破 → 3. 判定成功率 → 4a. 成功: 境界提升 / 4b. 失败: 修为损失
```

**突破规则**：
- 成功率由境界配置决定（越高境界成功率越低）
- 可使用丹药提升突破成功率
- 突破失败损失当前修为的 10%~30%
- MVP 阶段突破为即时判定，无动画

### 4.3 战斗系统

**核心机制**：回合制自动战斗，玩家选择挑战怪物，系统自动计算战斗结果。

```
战斗流程:
1. 选择怪物 → 2. 进入战斗 → 3. 回合制自动执行 → 4. 显示结果 → 5. 发放奖励
```

**战斗公式**：
```
伤害 = (攻击方.attack - 防御方.defense × 0.5) × 随机浮动(0.8~1.2)
伤害 = max(伤害, 1)  // 最低伤害为 1
```

**回合判定**：
- 每回合按速度值决定先手
- 先手攻击 → 后手攻击 → 判定是否结束
- 一方 HP 降为 0 时战斗结束

**MVP 简化**：
- 无技能系统，纯普攻
- 无逃跑机制
- 战斗为即时结算，显示战斗日志

### 4.4 资源系统

| 资源 | 获取方式 | 用途 |
|------|---------|------|
| 灵石 (gold) | 战斗奖励、出售物品 | 购买丹药、功法 |
| 修为 (cultivation) | 修炼 | 突破境界 |

### 4.5 背包系统

- MVP 阶段背包容量固定为 20 格
- 物品可堆叠（同类丹药/材料）
- 支持使用物品（丹药）和丢弃物品

### 4.6 日志系统

```typescript
interface LogEntry {
  id: string;
  type: 'cultivation' | 'battle' | 'breakthrough' | 'system' | 'trade';
  message: string;
  timestamp: number;
  details?: Record<string, any>;  // 结构化详情
}
```

- 日志按时间倒序排列
- MVP 阶段最多保留 100 条日志
- 分类型筛选显示

### 4.7 存档系统

**存储方案**：JSON 文件存储在服务端 `data/saves/` 目录下

```
data/saves/
├── save_001.json
├── save_002.json
└── autosave.json    # 自动存档
```

**存档策略**：
- 自动存档：每 60 秒自动保存一次
- 手动存档：玩家可随时手动保存
- 最多支持 3 个存档位
- 存档文件包含版本号，便于后续数据迁移

---

## 5. API 设计

### 5.1 基础约定

- 基础路径: `/api/v1`
- 请求格式: `application/json`
- 响应格式:
```typescript
interface ApiResponse<T> {
  code: number;       // 0=成功, 非0=错误码
  message: string;
  data: T;
}
```

### 5.2 API 列表

#### 存档管理
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/game/new` | 创建新游戏 |
| GET | `/game/load/:saveId` | 加载存档 |
| POST | `/game/save` | 保存游戏 |
| GET | `/game/saves` | 获取存档列表 |
| DELETE | `/game/save/:saveId` | 删除存档 |

#### 角色相关
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/character` | 获取角色信息 |
| POST | `/character/name` | 设置角色名称 |

#### 修炼相关
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/cultivation/start` | 开始修炼 |
| POST | `/cultivation/stop` | 停止修炼 |
| GET | `/cultivation/status` | 获取修炼状态 |
| POST | `/cultivation/tick` | 请求修炼结算 (前端定时调用) |

#### 突破相关
| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/breakthrough/attempt` | 尝试突破 |
| GET | `/breakthrough/info` | 获取突破信息 (成功率、所需修为等) |

#### 战斗相关
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/battle/monsters` | 获取可挑战的怪物列表 |
| POST | `/battle/start` | 开始战斗 |
| GET | `/battle/result/:battleId` | 获取战斗结果 |

#### 背包相关
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/inventory` | 获取背包信息 |
| POST | `/inventory/use` | 使用物品 |
| POST | `/inventory/discard` | 丢弃物品 |

#### 商店相关
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/shop/items` | 获取商店物品列表 |
| POST | `/shop/buy` | 购买物品 |

#### 功法相关
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/techniques` | 获取所有功法列表 |
| GET | `/techniques/learned` | 获取已学功法 |
| POST | `/techniques/learn` | 学习功法 |
| POST | `/techniques/activate` | 切换当前修炼功法 |

#### 日志相关
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/logs` | 获取日志列表 |
| GET | `/logs/:type` | 按类型获取日志 |

---

## 6. 前端页面设计

### 6.1 页面列表

| 页面 | 路由 | 说明 |
|------|------|------|
| 开始页面 | `/` | 新游戏 / 继续游戏 / 存档管理 |
| 主界面 | `/game` | 角色信息 + 修炼 + 快捷操作 |
| 修炼页 | `/game/cultivation` | 修炼详情、功法切换 |
| 战斗页 | `/game/battle` | 怪物选择、战斗日志 |
| 背包页 | `/game/inventory` | 物品管理 |
| 商店页 | `/game/shop` | 购买丹药、功法 |
| 日志页 | `/game/logs` | 查看历史日志 |

### 6.2 主界面布局

```
┌──────────────────────────────────────────────────┐
│  [角色名]  练气三层  |  灵石: 1200  |  [菜单]    │
├──────────┬───────────────────────┬───────────────┤
│          │                       │               │
│  角色    │     主内容区域         │   修炼状态    │
│  面板    │   (修炼/战斗/背包等)   │   实时面板    │
│          │                       │               │
│  - 属性  │                       │  - 修为进度   │
│  - 境界  │                       │  - 挂机收益   │
│  - 功法  │                       │  - 快捷操作   │
│          │                       │               │
├──────────┴───────────────────────┴───────────────┤
│  [修炼]  [战斗]  [背包]  [商店]  [日志]           │
└──────────────────────────────────────────────────┘
```

### 6.3 视觉风格定义：古风简约

**设计方向**：以中国传统美学为基调，追求水墨意境与现代简约的平衡。整体氛围沉静、留白、克制，避免花哨装饰堆砌。

#### 色彩体系

```css
:root {
  /* 主色调 — 水墨色阶 */
  --ink-primary: #1a1a2e;      /* 浓墨 — 主文字、标题 */
  --ink-secondary: #4a4a5a;    /* 淡墨 — 次要文字 */
  --ink-tertiary: #8a8a9a;     /* 灰墨 — 辅助文字、禁用态 */

  /* 背景色 — 宣纸色阶 */
  --paper-bg: #f5f0e8;         /* 宣纸底 — 主背景 */
  --paper-surface: #ede6d8;    /* 旧纸面 — 卡片、面板 */
  --paper-elevated: #faf6ef;   /* 浮纸面 — 弹窗、模态框 */

  /* 强调色 — 少量使用，用于关键操作和状态 */
  --jade-green: #5b8c5a;       /* 翠玉 — 成功、修炼、正向状态 */
  --cinnabar-red: #c45c5c;     /* 朱砂 — 警告、战斗、危险状态 */
  --gold-accent: #c9a96e;      /* 金箔 — 稀有、高级、货币 */
  --azure-blue: #5a7b9c;       /* 天青 — 信息、链接 */

  /* 边框与分隔 */
  --border-subtle: rgba(26, 26, 46, 0.08);
  --border-default: rgba(26, 26, 46, 0.15);
}
```

#### 字体方案

| 用途 | 字体 | 说明 |
|------|------|------|
| 标题/品牌 | `Noto Serif SC` (思源宋体) | 衬线体，古典气质，用于大标题和品牌名 |
| 正文/UI | `Noto Sans SC` (思源黑体) | 无衬线体，清晰易读，用于正文和 UI 文字 |
| 数字/数据 | `JetBrains Mono` 或 `Noto Sans SC` | 等宽或无衬线，用于属性数值、修为进度等 |

```css
font-family-heading: 'Noto Serif SC', 'Songti SC', serif;
font-family-body: 'Noto Sans SC', 'PingFang SC', sans-serif;
font-family-mono: 'JetBrains Mono', monospace;
```

#### 构图与布局原则

- **留白优先**：大面积留白营造水墨意境，内容区域不拥挤
- **纵向韵律**：信息按从上到下的自然阅读流排列，避免横向信息过载
- **三栏克制**：主界面采用左（角色）- 中（内容）- 右（状态）三栏，各栏职责单一
- **无卡片堆砌**：默认不使用卡片容器，用分隔线、留白、背景色差异区分区域
- **对称与平衡**：关键信息居中或左对齐，避免过度不对称

#### 动效规范

| 场景 | 动效 | 说明 |
|------|------|------|
| 修炼进度 | 缓慢呼吸式进度条 | 模拟气息流动，周期 3-4 秒 |
| 突破成功 | 金色粒子扩散 | 短暂 1-2 秒，不过度 |
| 战斗结算 | 结果淡入 + 数字滚动 | 数值变化有节奏感 |
| 页面切换 | 水墨晕染过渡 | 淡入淡出，300-500ms |
| 按钮交互 | 微弱墨迹扩散 | hover 时轻微效果，克制不花哨 |

#### 装饰元素（少量使用）

- **水墨纹理**：背景可叠加极淡的水墨纹理（SVG 或 CSS noise），透明度 < 5%
- **印章元素**：突破成功、重要成就可用红色印章风格标记
- **毛笔笔触**：分隔线可使用不规则的毛笔笔触效果（CSS 或 SVG）
- **山峦剪影**：页面底部或侧边可使用极简山峦轮廓作为装饰

#### 禁止事项

- ❌ 不使用渐变紫色/蓝色背景
- ❌ 不使用圆角卡片堆砌布局
- ❌ 不使用霓虹色、高饱和度色彩
- ❌ 不使用过于复杂的动画或粒子效果
- ❌ 不使用西式 fantasy 风格元素（如盾牌、宝剑图标）
- ❌ 不使用 Inter、Roboto、Arial 等通用字体

### 6.4 前端设计规范

本项目前端 UI 开发遵循以下设计原则，确保界面品质：

#### 设计思维流程

在实现任何页面或组件之前，需先明确：

1. **视觉论点**：用一句话描述该页面的氛围、材质和能量感
2. **内容规划**：确定 hero（主视觉）→ support（支撑信息）→ detail（细节）→ CTA（行动点）的层级
3. **交互论点**：2-3 个动效创意，用于提升页面感受

#### 核心设计原则

| 原则 | 说明 |
|------|------|
| **构图优先** | 先确定布局和空间关系，再填充组件 |
| **克制系统** | 最多两种字体、一个强调色，避免元素过多 |
| **文案精炼** | 标题承载含义，辅助文案一句话，删除冗余 |
| **动效有目的** | 每个动效必须服务于层级或氛围，否则移除 |
| **图像叙事** | 图标/插图需有叙事功能，纯装饰性元素尽量少用 |

#### 应用型 UI 规范（适用于本项目的游戏界面）

- 以 **Linear 风格的克制** 为参考：平静的层级、强排版、少色彩、信息密集但可读
- 围绕 **主工作区 + 导航 + 次要上下文** 组织界面
- 面板能用纯布局表达含义时，不添加卡片容器
- 工具型文案优先：标题说明"这是什么/能做什么"，而非营销语言

#### 质量检查清单

- [ ] 第一屏是否传达了清晰的氛围和品牌感？
- [ ] 是否有一个强视觉锚点（而非多个弱元素）？
- [ ] 仅扫描标题和数字能否理解页面内容？
- [ ] 每个区域是否只有一个职责？
- [ ] 动效是否改善了层级或氛围？
- [ ] 移除所有装饰阴影后，设计是否仍然精致？
- [ ] 色彩是否符合古风简约的基调？

---

## 7. JSON 数据文件设计

### 7.1 静态配置数据 (服务端 data/ 目录)

```
data/
├── realms.json          # 境界配置
├── techniques.json      # 功法配置
├── pills.json           # 丹药配置
├── monsters.json        # 怪物配置
├── areas.json           # 区域配置
└── saves/               # 存档目录
    ├── save_001.json
    └── autosave.json
```

### 7.2 realms.json 示例

```json
[
  {
    "id": "mortal",
    "name": "凡人",
    "stage": "凡人",
    "level": 0,
    "maxCultivation": 100,
    "breakthroughRate": 1.0,
    "statBonus": { "hp": 50, "mp": 20, "attack": 5, "defense": 3, "speed": 5 }
  },
  {
    "id": "qi_refining_1",
    "name": "练气一层",
    "stage": "练气期",
    "level": 1,
    "maxCultivation": 200,
    "breakthroughRate": 0.95,
    "statBonus": { "hp": 100, "mp": 50, "attack": 12, "defense": 8, "speed": 10 }
  },
  {
    "id": "qi_refining_2",
    "name": "练气二层",
    "stage": "练气期",
    "level": 2,
    "maxCultivation": 400,
    "breakthroughRate": 0.90,
    "statBonus": { "hp": 150, "mp": 80, "attack": 18, "defense": 12, "speed": 14 }
  }
]
```

---

## 8. 开发阶段规划

### Phase 1: 基础框架 (Week 1)
- [ ] 项目初始化 (monorepo + TypeScript 配置)
- [ ] 后端 Fastify 服务器搭建 (含 Zod 校验 + Pino 日志)
- [ ] 前端 React + Vite 搭建
- [ ] 共享类型定义
- [ ] JSON 数据加载与读取

### Phase 2: 核心系统 (Week 2)
- [ ] 角色创建与属性系统
- [ ] 修炼系统 (挂机 + 离线收益)
- [ ] 境界突破系统
- [ ] 存档系统 (保存/加载)

### Phase 3: 交互系统 (Week 3)
- [ ] 战斗系统 (回合制自动战斗)
- [ ] 背包系统
- [ ] 商店系统
- [ ] 功法系统

### Phase 4: 前端 UI (Week 4)
- [ ] 主界面布局
- [ ] 各功能页面
- [ ] 修炼进度实时显示
- [ ] 战斗日志展示
- [ ] 响应式适配

### Phase 5: 打磨 (Week 5)
- [ ] 日志系统完善
- [ ] 数据平衡性调整
- [ ] Bug 修复
- [ ] UI 美化

---

## 9. 待讨论事项

> 以下问题需要在后续迭代中逐步确认：

1. **战斗系统深度**：MVP 是否需要技能系统？还是纯自动战斗即可？
2. **社交系统**：MVP 是否需要 NPC 对话/宗门系统？
3. **事件系统**：是否需要随机事件（如奇遇、天劫）？
4. **UI 风格**：~~偏好古风水墨、像素风、还是现代简约？~~ ✅ 已确定：古风简约（水墨意境 + 现代克制）
5. **数据平衡**：修炼速度、战斗数值需要实际测试后调整
6. **多存档**：MVP 是否需要多存档位，还是单存档即可？
7. **重置功能**：是否需要"轮回/转世"机制？

---

## 附录 B: 后端技术规范 (Fastify)

### B.1 框架选型理由

| 对比项 | Fastify | Express |
|--------|---------|---------|
| 性能 | ~76k req/s | ~47k req/s |
| 内置 JSON Schema 校验 | ✅ 原生支持 | ❌ 需额外中间件 |
| 内置日志 (Pino) | ✅ 原生集成 | ❌ 需额外配置 |
| TypeScript 支持 | ✅ 优秀 | ⚠️ 需 @types 补充 |
| 插件生态 | 丰富且自动管理依赖 | 丰富但依赖管理较松散 |
| 异步支持 | ✅ 原生 async/await | ⚠️ 部分回调风格 |

### B.2 项目结构 (后端)

```
packages/server/src/
├── app.ts                 # Fastify 实例创建与配置
├── server.ts              # 服务启动入口
├── config/                # 配置管理
│   └── index.ts           # 环境变量 + 默认配置
├── plugins/               # Fastify 插件注册
│   ├── cors.ts            # CORS 配置
│   ├── errorHandler.ts    # 全局错误处理
│   └── auth.ts            # 鉴权 (如需要)
├── routes/                # 路由定义 (含 JSON Schema 校验)
│   ├── game.ts
│   ├── character.ts
│   ├── cultivation.ts
│   ├── breakthrough.ts
│   ├── battle.ts
│   ├── inventory.ts
│   ├── shop.ts
│   ├── techniques.ts
│   └── logs.ts
├── services/              # 业务逻辑层
│   ├── gameService.ts
│   ├── characterService.ts
│   ├── cultivationService.ts
│   ├── battleService.ts
│   └── ...
├── models/                # 数据访问层 (JSON 文件读写)
│   ├── saveModel.ts       # 存档读写
│   └── dataLoader.ts      # 静态配置加载
├── schemas/               # Zod Schema 定义
│   ├── character.ts
│   ├── saveData.ts
│   ├── battle.ts
│   └── ...
├── types/                 # 类型定义
├── utils/                 # 工具函数
└── data/                  # JSON 静态数据
    ├── realms.json
    ├── techniques.json
    ├── pills.json
    ├── monsters.json
    └── saves/             # 存档目录
```

### B.3 Fastify 应用初始化示例

```typescript
// app.ts
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { errorHandler } from './plugins/errorHandler';
import { registerRoutes } from './routes';

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.LOG_LEVEL ?? 'info',
      transport: process.env.NODE_ENV === 'development'
        ? { target: 'pino-pretty' }
        : undefined,
    },
  });

  // 注册插件
  await app.register(cors, { origin: 'http://localhost:5173' });
  app.setErrorHandler(errorHandler);

  // 注册路由
  await app.register(registerRoutes, { prefix: '/api/v1' });

  return app;
}
```

### B.4 路由 + Schema 校验示例

```typescript
// routes/cultivation.ts
import { FastifyPluginAsync } from 'fastify';
import { cultivationService } from '../services/cultivationService';
import { startCultivationSchema, stopCultivationSchema } from '../schemas/cultivation';

export const cultivationRoutes: FastifyPluginAsync = async (app) => {
  // POST /cultivation/start
  app.post('/cultivation/start', {
    schema: {
      body: startCultivationSchema,
      response: {
        200: {
          type: 'object',
          properties: {
            code: { type: 'number' },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
    handler: async (request, reply) => {
      const result = await cultivationService.start(request.body);
      return { code: 0, message: 'ok', data: result };
    },
  });

  // POST /cultivation/stop
  app.post('/cultivation/stop', {
    schema: {
      response: { 200: /* ... */ },
    },
    handler: async (request, reply) => {
      const result = await cultivationService.stop();
      return { code: 0, message: 'ok', data: result };
    },
  });
};
```

### B.5 Zod Schema 定义示例

```typescript
// schemas/cultivation.ts
import { z } from 'zod';

export const startCultivationSchema = z.object({
  techniqueId: z.string().optional(),  // 可选：指定修炼功法
});

// schemas/saveData.ts — 存档校验，防止数据损坏
export const SaveDataSchema = z.object({
  version: z.string(),
  character: CharacterSchema,
  inventory: InventorySchema,
  techniques: z.array(z.string()),
  activeTechnique: z.string(),
  battleLog: z.array(LogEntrySchema),
  eventLog: z.array(LogEntrySchema),
  unlockedAreas: z.array(z.string()),
  saveTime: z.number(),
});
```

### B.6 JSON 存档安全读写

```typescript
// models/saveModel.ts
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'fs';
import { SaveDataSchema } from '../schemas/saveData';

const SAVE_DIR = './data/saves';

export const saveModel = {
  load(saveId: string) {
    const path = `${SAVE_DIR}/${saveId}.json`;
    if (!existsSync(path)) throw new Error(`存档 ${saveId} 不存在`);

    const raw = JSON.parse(readFileSync(path, 'utf-8'));
    return SaveDataSchema.parse(raw);  // Zod 校验，数据损坏时抛错
  },

  save(saveId: string, data: unknown) {
    const validated = SaveDataSchema.parse(data);  // 写入前校验
    const path = `${SAVE_DIR}/${saveId}.json`;

    // 写入前备份
    if (existsSync(path)) {
      copyFileSync(path, `${path}.bak`);
    }

    writeFileSync(path, JSON.stringify(validated, null, 2), 'utf-8');
  },
};
```

### B.7 全局错误处理

```typescript
// plugins/errorHandler.ts
import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

export function errorHandler(
  error: FastifyError | ZodError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  request.log.error(error);

  if (error instanceof ZodError) {
    return reply.status(400).send({
      code: 400,
      message: '参数校验失败',
      data: error.errors,
    });
  }

  const statusCode = 'statusCode' in error ? (error as FastifyError).statusCode : 500;
  return reply.status(statusCode).send({
    code: statusCode,
    message: error.message ?? '服务器内部错误',
    data: null,
  });
}
```

### B.8 开发与运行命令

```json
{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  }
}
```

### B.9 核心依赖清单

| 包名 | 用途 |
|------|------|
| `fastify` | Web 框架 |
| `@fastify/cors` | CORS 跨域支持 |
| `zod` | 运行时数据校验 |
| `pino` | 日志 (Fastify 内置) |
| `pino-pretty` | 开发环境日志美化 |
| `uuid` | 生成唯一 ID |
| `dotenv` | 环境变量管理 |

---

## 附录 A: 名词表

| 术语 | 说明 |
|------|------|
| 境界 | 修仙者的等级体系，如练气、筑基、金丹、元婴 |
| 修为 | 修炼积累的经验值，达到上限后可突破 |
| 突破 | 从当前境界晋升到下一境界的过程 |
| 功法 | 修炼功法，影响修炼速度和属性加成 |
| 灵石 | 游戏内通用货币 |
| 挂机 | 离线状态下自动积累修为的机制 |
