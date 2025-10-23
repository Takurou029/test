import { PlayerStatus, Task, CategoryToStat, TaskCompletion, Stats } from '../types';

// レベルアップに必要な経験値を計算
export const calculateExpForLevel = (level: number): number => {
  return Math.floor(100 * Math.pow(1.5, level - 1));
};

// 経験値を追加してレベルアップ処理を行う
export const addExperience = (
  player: PlayerStatus,
  exp: number,
  task: Task
): PlayerStatus => {
  let newPlayer = { ...player };
  newPlayer.currentExp += exp;

  // レベルアップチェック
  while (newPlayer.currentExp >= newPlayer.expToNextLevel) {
    newPlayer.currentExp -= newPlayer.expToNextLevel;
    newPlayer.level += 1;
    newPlayer.expToNextLevel = calculateExpForLevel(newPlayer.level);

    // レベルアップ時に全ステータスを1ずつ増加
    newPlayer.strength += 1;
    newPlayer.intelligence += 1;
    newPlayer.spirit += 1;
    newPlayer.vitality += 1;
    newPlayer.charm += 1;
  }

  // タスクのカテゴリに応じたステータスを追加で増加
  const statToIncrease = CategoryToStat[task.category];
  const statBonus = task.difficulty; // 難易度に応じてボーナス
  newPlayer[statToIncrease] += statBonus;

  return newPlayer;
};

// 連続達成日数を計算
export const calculateStreak = (completions: TaskCompletion[]): { currentStreak: number; longestStreak: number } => {
  if (completions.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // 日付ごとにグループ化
  const dateSet = new Set(
    completions.map(c => new Date(c.completedAt).toDateString())
  );
  const sortedDates = Array.from(dateSet).sort((a, b) =>
    new Date(b).getTime() - new Date(a).getTime()
  );

  // 現在の連続日数を計算
  let currentStreak = 0;
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (sortedDates[0] === today || sortedDates[0] === yesterday) {
    currentStreak = 1;
    let expectedDate = new Date(sortedDates[0]);

    for (let i = 1; i < sortedDates.length; i++) {
      expectedDate = new Date(expectedDate.getTime() - 86400000);
      if (sortedDates[i] === expectedDate.toDateString()) {
        currentStreak++;
      } else {
        break;
      }
    }
  }

  // 最長連続日数を計算
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = Math.floor((prevDate.getTime() - currDate.getTime()) / 86400000);

    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  return { currentStreak, longestStreak };
};

// タスク完了報酬を計算
export const calculateTaskReward = (task: Task): number => {
  // 基本経験値 = 難易度 × 10
  return task.difficulty * 10;
};

// 今日完了したタスクIDのセットを取得
export const getTodayCompletedTaskIds = (completions: TaskCompletion[]): Set<string> => {
  const today = new Date().toDateString();
  return new Set(
    completions
      .filter(c => new Date(c.completedAt).toDateString() === today)
      .map(c => c.taskId)
  );
};

// 統計情報を更新
export const updateStats = (
  stats: Stats,
  completions: TaskCompletion[],
  tasks: Task[]
): Stats => {
  const { currentStreak, longestStreak } = calculateStreak(completions);

  const completionsByCategory = { ...stats.completionsByCategory };
  completions.forEach(completion => {
    const task = tasks.find(t => t.id === completion.taskId);
    if (task) {
      completionsByCategory[task.category]++;
    }
  });

  const lastCompletion = completions.length > 0
    ? completions[completions.length - 1].completedAt
    : undefined;

  return {
    totalTasksCompleted: completions.length,
    currentStreak,
    longestStreak,
    completionsByCategory,
    lastCompletionDate: lastCompletion,
  };
};
