import { useState, useEffect } from 'react';
import { AppState, Task, TaskCompletion } from '../types';
import { loadState, saveState, initialState } from '../utils/storage';
import {
  addExperience,
  calculateTaskReward,
  getTodayCompletedTaskIds,
  updateStats,
} from '../utils/gameLogic';

export const useAppState = () => {
  const [state, setState] = useState<AppState>(initialState);
  const [isLoading, setIsLoading] = useState(true);

  // 初回ロード
  useEffect(() => {
    const loadedState = loadState();
    setState(loadedState);
    setIsLoading(false);
  }, []);

  // 状態が変更されるたびに保存
  useEffect(() => {
    if (!isLoading) {
      saveState(state);
    }
  }, [state, isLoading]);

  // タスクを追加
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask],
    }));
  };

  // タスクを更新
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    }));
  };

  // タスクを削除
  const deleteTask = (taskId: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== taskId),
      completions: prev.completions.filter(c => c.taskId !== taskId),
    }));
  };

  // タスクを完了
  const completeTask = (taskId: string) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    // 今日既に完了しているかチェック
    const todayCompleted = getTodayCompletedTaskIds(state.completions);
    if (todayCompleted.has(taskId)) {
      alert('このタスクは本日既に完了しています！');
      return;
    }

    const completion: TaskCompletion = {
      taskId,
      completedAt: new Date().toISOString(),
    };

    const expReward = calculateTaskReward(task);
    const newPlayer = addExperience(state.player, expReward, task);
    const newCompletions = [...state.completions, completion];
    const newStats = updateStats(state.stats, newCompletions, state.tasks);

    setState(prev => ({
      ...prev,
      player: newPlayer,
      completions: newCompletions,
      stats: newStats,
    }));

    return { expGained: expReward, leveledUp: newPlayer.level > state.player.level };
  };

  // 今日完了したタスクのIDセットを取得
  const todayCompletedTaskIds = getTodayCompletedTaskIds(state.completions);

  // データをリセット
  const resetData = () => {
    if (confirm('本当に全てのデータをリセットしますか？この操作は取り消せません。')) {
      setState(initialState);
      saveState(initialState);
    }
  };

  return {
    state,
    isLoading,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    todayCompletedTaskIds,
    resetData,
  };
};
