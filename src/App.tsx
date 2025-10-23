import { useState } from 'react';
import { useAppState } from './hooks/useAppState';
import { PlayerStatus } from './components/PlayerStatus';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { StatsPanel } from './components/StatsPanel';
import { Task } from './types';

type Tab = 'tasks' | 'stats';

function App() {
  const {
    state,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    todayCompletedTaskIds,
    resetData,
  } = useAppState();

  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [levelUpMessage, setLevelUpMessage] = useState<string | null>(null);

  const handleCompleteTask = (taskId: string) => {
    const result = completeTask(taskId);
    if (result) {
      if (result.leveledUp) {
        setLevelUpMessage(`レベルアップ！ Lv.${state.player.level} → Lv.${state.player.level + 1}`);
        setTimeout(() => setLevelUpMessage(null), 3000);
      }
    }
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleCancelForm = () => {
    setShowTaskForm(false);
    setEditingTask(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">自分磨きRPG</h1>
          <p className="text-gray-600">日々の習慣でレベルアップしよう！</p>
        </header>

        {/* レベルアップメッセージ */}
        {levelUpMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-4 rounded-full shadow-2xl text-xl font-bold">
              ⭐ {levelUpMessage} ⭐
            </div>
          </div>
        )}

        {/* プレイヤーステータス */}
        <div className="mb-8">
          <PlayerStatus player={state.player} />
        </div>

        {/* タブナビゲーション */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 py-3 px-6 font-semibold rounded-lg transition-colors ${
              activeTab === 'tasks'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📝 タスク一覧
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex-1 py-3 px-6 font-semibold rounded-lg transition-colors ${
              activeTab === 'stats'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            📊 統計情報
          </button>
        </div>

        {/* コンテンツ */}
        {activeTab === 'tasks' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                今日のタスク
              </h2>
              <button
                onClick={() => setShowTaskForm(true)}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                タスクを追加
              </button>
            </div>

            <TaskList
              tasks={state.tasks}
              todayCompletedTaskIds={todayCompletedTaskIds}
              onCompleteTask={handleCompleteTask}
              onEditTask={handleEditTask}
              onDeleteTask={deleteTask}
            />
          </div>
        )}

        {activeTab === 'stats' && (
          <div>
            <StatsPanel stats={state.stats} />
          </div>
        )}

        {/* フッター */}
        <footer className="mt-12 text-center">
          <button
            onClick={resetData}
            className="text-sm text-gray-400 hover:text-red-600 transition-colors"
          >
            全データをリセット
          </button>
        </footer>
      </div>

      {/* タスクフォームモーダル */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          onSave={handleSaveTask}
          onCancel={handleCancelForm}
        />
      )}
    </div>
  );
}

export default App;
