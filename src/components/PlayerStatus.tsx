import React from 'react';
import { PlayerStatus as PlayerStatusType } from '../types';

interface Props {
  player: PlayerStatusType;
}

export const PlayerStatus: React.FC<Props> = ({ player }) => {
  const expPercentage = (player.currentExp / player.expToNextLevel) * 100;

  const stats = [
    { label: '筋力', value: player.strength, icon: '💪', color: 'text-red-600' },
    { label: '知性', value: player.intelligence, icon: '🧠', color: 'text-blue-600' },
    { label: '精神', value: player.spirit, icon: '🧘', color: 'text-purple-600' },
    { label: '体力', value: player.vitality, icon: '❤️', color: 'text-green-600' },
    { label: '魅力', value: player.charm, icon: '✨', color: 'text-yellow-600' },
  ];

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">あなたのステータス</h2>
        <div className="text-3xl font-bold text-primary-600">Lv.{player.level}</div>
      </div>

      {/* 経験値バー */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>EXP</span>
          <span>{player.currentExp} / {player.expToNextLevel}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${expPercentage}%` }}
          />
        </div>
      </div>

      {/* ステータス一覧 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map(stat => (
          <div
            key={stat.label}
            className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200"
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-xs text-gray-600 mb-1">{stat.label}</div>
            <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
