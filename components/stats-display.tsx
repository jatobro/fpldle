import { UserStats } from "@/lib/definitions";

export const StatsDisplay = ({ stats }: { stats: UserStats }) => {
  return (
    <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
      <div className="bg-white/20 rounded-lg p-2">
        <div className="font-bold">{stats.gamesPlayed}</div>
        <div className="opacity-80">Played</div>
      </div>
      <div className="bg-white/20 rounded-lg p-2">
        <div className="font-bold">{stats.winPercentage}%</div>
        <div className="opacity-80">Win %</div>
      </div>
      <div className="bg-white/20 rounded-lg p-2">
        <div className="font-bold">{stats.currentStreak}</div>
        <div className="opacity-80">Streak</div>
      </div>
      <div className="bg-white/20 rounded-lg p-2">
        <div className="font-bold">{stats.maxStreak}</div>
        <div className="opacity-80">Max Streak</div>
      </div>
      <div className="bg-white/20 rounded-lg p-2 col-span-2">
        <div className="font-bold">{stats.averageGuesses}</div>
        <div className="opacity-80">Avg Guesses</div>
      </div>
    </div>
  );
};
