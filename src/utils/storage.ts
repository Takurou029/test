import { AppState, TaskCategory } from '../types';

const STORAGE_KEY = 'self-improvement-app-state';

// 初期状態
export const initialState: AppState = {
  player: {
    level: 1,
    currentExp: 0,
    expToNextLevel: 100,
    strength: 1,
    intelligence: 1,
    spirit: 1,
    vitality: 1,
    charm: 1,
  },
  tasks: [],
  completions: [],
  stats: {
    totalTasksCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    completionsByCategory: {
      [TaskCategory.FITNESS]: 0,
      [TaskCategory.LEARNING]: 0,
      [TaskCategory.MINDFULNESS]: 0,
      [TaskCategory.HEALTH]: 0,
      [TaskCategory.GROOMING]: 0,
      [TaskCategory.SOCIAL]: 0,
      [TaskCategory.CREATIVE]: 0,
      [TaskCategory.OTHER]: 0,
    },
  },
};

// ローカルストレージから状態を読み込み
export const loadState = (): AppState => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return initialState;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('状態の読み込みに失敗しました:', err);
    return initialState;
  }
};

// ローカルストレージに状態を保存
export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error('状態の保存に失敗しました:', err);
  }
};
