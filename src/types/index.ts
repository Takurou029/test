// ユーザーのステータス
export interface PlayerStatus {
  level: number;
  currentExp: number;
  expToNextLevel: number;
  strength: number;      // 筋力
  intelligence: number;  // 知性
  spirit: number;        // 精神
  vitality: number;      // 体力
  charm: number;         // 魅力
}

// タスクのカテゴリ
export enum TaskCategory {
  FITNESS = 'fitness',           // 運動・筋トレ
  LEARNING = 'learning',         // 学習・スキル
  MINDFULNESS = 'mindfulness',   // 瞑想・メンタル
  HEALTH = 'health',             // 健康習慣
  GROOMING = 'grooming',         // 身だしなみ
  SOCIAL = 'social',             // 社交・コミュニケーション
  CREATIVE = 'creative',         // 創作活動
  OTHER = 'other'                // その他
}

// カテゴリに対応するステータス
export const CategoryToStat: Record<TaskCategory, keyof Omit<PlayerStatus, 'level' | 'currentExp' | 'expToNextLevel'>> = {
  [TaskCategory.FITNESS]: 'strength',
  [TaskCategory.LEARNING]: 'intelligence',
  [TaskCategory.MINDFULNESS]: 'spirit',
  [TaskCategory.HEALTH]: 'vitality',
  [TaskCategory.GROOMING]: 'charm',
  [TaskCategory.SOCIAL]: 'charm',
  [TaskCategory.CREATIVE]: 'intelligence',
  [TaskCategory.OTHER]: 'vitality'
};

// タスク
export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  expReward: number;      // 獲得経験値
  difficulty: 1 | 2 | 3;  // 難易度（1: 簡単、2: 普通、3: 難しい）
  isDaily: boolean;       // 毎日のタスクかどうか
  reminderTime?: string;  // リマインド時刻（HH:MM形式）
  createdAt: string;
}

// タスクの完了記録
export interface TaskCompletion {
  taskId: string;
  completedAt: string;    // ISO8601形式
}

// 統計情報
export interface Stats {
  totalTasksCompleted: number;
  currentStreak: number;          // 現在の連続達成日数
  longestStreak: number;          // 最長連続達成日数
  completionsByCategory: Record<TaskCategory, number>;
  lastCompletionDate?: string;    // 最後にタスクを完了した日
}

// アプリケーション全体の状態
export interface AppState {
  player: PlayerStatus;
  tasks: Task[];
  completions: TaskCompletion[];
  stats: Stats;
}
