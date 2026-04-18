import { useState } from 'react';
import { useGameStore } from '../store/gameStore';

type TabKey = 'cultivation' | 'battle' | 'inventory' | 'shop' | 'logs';

interface TabItem {
  key: TabKey;
  label: string;
  icon: string;
}

const tabs: TabItem[] = [
  { key: 'cultivation', label: '修炼', icon: '\u26A1' },
  { key: 'battle', label: '战斗', icon: '\u2694' },
  { key: 'inventory', label: '背包', icon: '\uD83C\uDF92' },
  { key: 'shop', label: '商店', icon: '\uD83C\uDFEA' },
  { key: 'logs', label: '日志', icon: '\uD83D\uDCDC' },
];

export function GamePage() {
  const [activeTab, setActiveTab] = useState<TabKey>('cultivation');
  const { character, saveData, isLoading, error } = useGameStore();

  return (
    <div className="game-page">
      {/* 三栏布局 */}
      <div className="game-layout">
        {/* 左侧：角色面板 */}
        <aside className="panel panel-left">
          <div className="panel-header">角色信息</div>
          <div className="panel-body">
            {character ? (
              <div className="character-info">
                <div className="character-name">{character.name || '无名散修'}</div>
                <div className="character-detail">
                  <span>境界</span>
                  <span>{character.realm || '凡人'}</span>
                </div>
                <div className="character-detail">
                  <span>修为</span>
                  <span>{character.cultivation ?? 0}</span>
                </div>
                <div className="character-detail">
                  <span>生命</span>
                  <span>{character.hp ?? 100} / {character.maxHp ?? 100}</span>
                </div>
                <div className="character-detail">
                  <span>灵力</span>
                  <span>{character.mp ?? 50} / {character.maxMp ?? 50}</span>
                </div>
                <div className="character-detail">
                  <span>灵石</span>
                  <span>{character.spiritStones ?? 0}</span>
                </div>
              </div>
            ) : (
              <div className="placeholder-text">暂无角色数据</div>
            )}
          </div>
        </aside>

        {/* 中间：内容区 */}
        <main className="panel panel-center">
          <div className="panel-header">
            {tabs.find((t) => t.key === activeTab)?.label ?? '修炼'}
          </div>
          <div className="panel-body">
            {isLoading && <div className="loading-text">加载中...</div>}
            {error && <div className="error-message">{error}</div>}

            {activeTab === 'cultivation' && (
              <div className="tab-content">
                <div className="placeholder-text">
                  <h3>修炼</h3>
                  <p>在此处进行修炼、突破境界、切换功法等操作。</p>
                  <ul>
                    <li>开始/停止修炼</li>
                    <li>查看修炼进度</li>
                    <li>尝试突破</li>
                    <li>切换功法</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'battle' && (
              <div className="tab-content">
                <div className="placeholder-text">
                  <h3>战斗</h3>
                  <p>在此处选择妖兽进行战斗，获取经验和战利品。</p>
                  <ul>
                    <li>查看可挑战的妖兽</li>
                    <li>开始战斗</li>
                    <li>查看战斗结果</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'inventory' && (
              <div className="tab-content">
                <div className="placeholder-text">
                  <h3>背包</h3>
                  <p>在此处管理背包中的物品。</p>
                  <ul>
                    <li>查看物品列表</li>
                    <li>使用物品</li>
                    <li>丢弃物品</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'shop' && (
              <div className="tab-content">
                <div className="placeholder-text">
                  <h3>商店</h3>
                  <p>在此处购买丹药、法器等物品。</p>
                  <ul>
                    <li>浏览商品</li>
                    <li>购买物品</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'logs' && (
              <div className="tab-content">
                <div className="placeholder-text">
                  <h3>日志</h3>
                  <p>在此处查看游戏事件记录。</p>
                  <ul>
                    <li>修炼日志</li>
                    <li>战斗日志</li>
                    <li>系统消息</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* 右侧：修炼状态 */}
        <aside className="panel panel-right">
          <div className="panel-header">修炼状态</div>
          <div className="panel-body">
            <div className="placeholder-text">
              <h3>当前状态</h3>
              <p>修炼中 / 休息中</p>
              <div className="status-placeholder">
                <div>功法：--</div>
                <div>修炼速度：--</div>
                <div>下次突破：--</div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* 底部导航栏 */}
      <nav className="bottom-nav">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`nav-item ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            <span className="nav-icon">{tab.icon}</span>
            <span className="nav-label">{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
