import React from 'react';
import { Task, TaskCategory } from '../types';

interface Props {
  tasks: Task[];
  todayCompletedTaskIds: Set<string>;
  onCompleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
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

const difficultyLabels: Record<1 | 2 | 3, string> = {
  1: '簡単',
  2: '普通',
  3: '難しい',
};

const difficultyColors: Record<1 | 2 | 3, string> = {
  1: 'bg-green-100 text-green-800',
  2: 'bg-yellow-100 text-yellow-800',
  3: 'bg-red-100 text-red-800',
};

export const TaskList: React.FC<Props> = ({
  tasks,
  todayCompletedTaskIds,
  onCompleteTask,
  onEditTask,
  onDeleteTask,
}) => {
  if (tasks.length === 0) {
    return (
      <div className="card text-center text-gray-500">
        <p className="text-lg">まだタスクがありません</p>
        <p className="text-sm mt-2">「タスクを追加」ボタンから新しいタスクを作成しましょう！</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => {
        const isCompleted = todayCompletedTaskIds.has(task.id);
        const expReward = task.difficulty * 10;

        return (
          <div
            key={task.id}
            className={`card ${isCompleted ? 'opacity-60 border-2 border-green-400' : ''}`}
          >
            <div className="flex items-start gap-4">
              {/* チェックボックス */}
              <button
                onClick={() => !isCompleted && onCompleteTask(task.id)}
                disabled={isCompleted}
                className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isCompleted
                    ? 'bg-green-500 border-green-500 cursor-not-allowed'
                    : 'border-gray-300 hover:border-primary-500 cursor-pointer'
                }`}
              >
                {isCompleted && <span className="text-white text-xl">✓</span>}
              </button>

              {/* タスク情報 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xl">{categoryIcons[task.category]}</span>
                    <h3 className={`font-semibold text-lg ${isCompleted ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => onEditTask(task)}
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                      title="編集"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`「${task.title}」を削除しますか？`)) {
                          onDeleteTask(task.id);
                        }
                      }}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      title="削除"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                {task.description && (
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                )}

                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="px-2 py-1 bg-primary-100 text-primary-800 rounded">
                    {categoryLabels[task.category]}
                  </span>
                  <span className={`px-2 py-1 rounded ${difficultyColors[task.difficulty]}`}>
                    {difficultyLabels[task.difficulty]}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded">
                    +{expReward} EXP
                  </span>
                  {task.isDaily && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      毎日
                    </span>
                  )}
                  {task.reminderTime && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded">
                      🔔 {task.reminderTime}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
