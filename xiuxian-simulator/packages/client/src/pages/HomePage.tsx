import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

interface SaveInfo {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export function HomePage() {
  const navigate = useNavigate();
  const [saves, setSaves] = useState<SaveInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSaves();
  }, []);

  async function loadSaves() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getSaves() as SaveInfo[];
      setSaves(data);
    } catch (err) {
      // 后端未启动时忽略错误，仅显示空列表
      setSaves([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleNewGame() {
    setLoading(true);
    setError(null);
    try {
      await api.createGame();
      navigate('/game');
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建游戏失败');
    } finally {
      setLoading(false);
    }
  }

  async function handleContinueGame(saveId: string) {
    setLoading(true);
    setError(null);
    try {
      await api.loadGame(saveId);
      navigate('/game');
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载存档失败');
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteSave(saveId: string, e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('确定要删除此存档吗？')) return;
    setLoading(true);
    setError(null);
    try {
      await api.deleteSave(saveId);
      setSaves((prev) => prev.filter((s) => s.id !== saveId));
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除存档失败');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="home-page">
      <div className="home-container">
        {/* 标题区域 */}
        <div className="home-title">
          <h1>修仙模拟器</h1>
          <p className="home-subtitle">踏破凡尘，问道长生</p>
        </div>

        {/* 错误提示 */}
        {error && <div className="error-message">{error}</div>}

        {/* 操作按钮 */}
        <div className="home-actions">
          <button
            className="btn btn-primary btn-lg"
            onClick={handleNewGame}
            disabled={loading}
          >
            开始新游戏
          </button>

          {saves.length > 0 && (
            <div className="saves-section">
              <h2>存档列表</h2>
              <ul className="saves-list">
                {saves.map((save) => (
                  <li key={save.id} className="save-item">
                    <div className="save-info" onClick={() => handleContinueGame(save.id)}>
                      <span className="save-name">{save.name}</span>
                      <span className="save-date">
                        {new Date(save.updatedAt).toLocaleString('zh-CN')}
                      </span>
                    </div>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={(e) => handleDeleteSave(save.id, e)}
                      disabled={loading}
                    >
                      删除
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
