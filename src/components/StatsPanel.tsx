import React from 'react';
import { Stats, TaskCategory } from '../types';

interface Props {
  stats: Stats;
}

const categoryLabels: Record<TaskCategory, string> = {
  [TaskCategory.FITNESS]: '運動',
  [TaskCategory.LEARNING]: '学習',
  [TaskCategory.MINDFULNESS]: '精神',
  [TaskCategory.HEALTH]: '健康',
  [TaskCategory.GROOMING]: '身だしなみ',
  [TaskCategory.SOCIAL]: '社交',
  [TaskCategory.CREATIVE]: '創作',
  [TaskCategory.OTHER]: 'その他',
};

const categoryIcons: Record<TaskCategory, string> = {
  [TaskCategory.FITNESS]: '💪',
  [TaskCategory.LEARNING]: '📚',
  [TaskCategory.MINDFULNESS]: '🧘',
  [TaskCategory.HEALTH]: '🥗',
  [TaskCategory.GROOMING]: '✂️',
  [TaskCategory.SOCIAL]: '👥',
  [TaskCategory.CREATIVE]: '🎨',
  [TaskCategory.OTHER]: '📌',
};

export const StatsPanel: React.FC<Props> = ({ stats }) => {
  return (
    <div className="card">
      <h2 className="text-2xl font-bold mb-6">統計情報</h2>

      {/* 主要統計 */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
          <div className="text-3xl mb-1">📊</div>
          <div className="text-sm text-gray-600 mb-1">総完了数</div>
          <div className="text-2xl font-bold text-blue-600">
            {stats.totalTasksCompleted}
          </div>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
          <div className="text-3xl mb-1">🔥</div>
          <div className="text-sm text-gray-600 mb-1">連続日数</div>
          <div className="text-2xl font-bold text-orange-600">
            {stats.currentStreak}日
          </div>
        </div>

        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
          <div className="text-3xl mb-1">🏆</div>
          <div className="text-sm text-gray-600 mb-1">最長記録</div>
          <div className="text-2xl font-bold text-purple-600">
            {stats.longestStreak}日
          </div>
        </div>
      </div>

      {/* カテゴリ別統計 */}
      <div>
        <h3 className="font-semibold mb-3 text-gray-700">カテゴリ別完了数</h3>
        <div className="space-y-2">
          {Object.entries(stats.completionsByCategory)
            .filter(([_, count]) => count > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([category, count]) => {
              const cat = category as TaskCategory;
              return (
                <div key={category} className="flex items-center gap-3">
                  <span className="text-xl">{categoryIcons[cat]}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">{categoryLabels[cat]}</span>
                      <span className="text-sm font-bold text-primary-600">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(count / stats.totalTasksCompleted) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        {stats.totalTasksCompleted === 0 && (
          <p className="text-center text-gray-500 text-sm py-4">
            まだタスクを完了していません
          </p>
        )}
      </div>
    </div>
  );
};
