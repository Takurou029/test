import React, { useState } from 'react';
import { Task, TaskCategory } from '../types';

interface Props {
  task?: Task;
  onSave: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const categoryOptions = [
  { value: TaskCategory.FITNESS, label: '💪 運動・筋トレ' },
  { value: TaskCategory.LEARNING, label: '📚 学習・スキル' },
  { value: TaskCategory.MINDFULNESS, label: '🧘 瞑想・メンタル' },
  { value: TaskCategory.HEALTH, label: '🥗 健康習慣' },
  { value: TaskCategory.GROOMING, label: '✂️ 身だしなみ' },
  { value: TaskCategory.SOCIAL, label: '👥 社交' },
  { value: TaskCategory.CREATIVE, label: '🎨 創作活動' },
  { value: TaskCategory.OTHER, label: '📌 その他' },
];

export const TaskForm: React.FC<Props> = ({ task, onSave, onCancel }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [category, setCategory] = useState<TaskCategory>(task?.category || TaskCategory.FITNESS);
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(task?.difficulty || 2);
  const [isDaily, setIsDaily] = useState(task?.isDaily || false);
  const [reminderTime, setReminderTime] = useState(task?.reminderTime || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('タスク名を入力してください');
      return;
    }

    const expReward = difficulty * 10;

    onSave({
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      difficulty,
      isDaily,
      expReward,
      reminderTime: reminderTime || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {task ? 'タスクを編集' : '新しいタスク'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* タスク名 */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                タスク名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="例: 腕立て伏せ30回"
                maxLength={100}
              />
            </div>

            {/* 説明 */}
            <div>
              <label className="block text-sm font-semibold mb-2">説明</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="タスクの詳細や目的など"
                rows={3}
                maxLength={500}
              />
            </div>

            {/* カテゴリ */}
            <div>
              <label className="block text-sm font-semibold mb-2">カテゴリ</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as TaskCategory)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {categoryOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 難易度 */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                難易度（獲得EXP: {difficulty * 10}）
              </label>
              <div className="grid grid-cols-3 gap-2">
                {([1, 2, 3] as const).map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`py-2 px-4 rounded-lg font-semibold transition-colors ${
                      difficulty === level
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level === 1 && '簡単'}
                    {level === 2 && '普通'}
                    {level === 3 && '難しい'}
                  </button>
                ))}
              </div>
            </div>

            {/* 毎日のタスク */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDaily}
                  onChange={e => setIsDaily(e.target.checked)}
                  className="w-5 h-5 text-primary-600 rounded focus:ring-2 focus:ring-primary-500"
                />
                <span className="text-sm font-semibold">毎日のタスク</span>
              </label>
            </div>

            {/* リマインダー時刻 */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                リマインダー時刻（オプション）
              </label>
              <input
                type="time"
                value={reminderTime}
                onChange={e => setReminderTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                ※ブラウザ通知機能は今後実装予定です
              </p>
            </div>

            {/* ボタン */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 btn-secondary"
              >
                キャンセル
              </button>
              <button type="submit" className="flex-1 btn-primary">
                {task ? '更新' : '作成'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
