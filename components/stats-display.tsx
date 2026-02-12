import { UserStats } from "@/lib/definitions";

export function StatsDisplay({ userStats }: { userStats: UserStats }) {
  const {
    gamesPlayed,
    winPercentage,
    currentStreak,
    maxStreak,
    averageGuesses,
  } = userStats;

  return (
    <div className="mt-4 grid grid-cols-3 gap-2 text-sm md:mt-6 md:gap-3 md:text-base">
      <div className="bg-foreground/10 border-foreground/20 rounded-lg border p-2 backdrop-blur-sm md:p-3">
        <div className="font-bold">{gamesPlayed}</div>
        <div className="text-xs opacity-80 md:text-sm">Played</div>
      </div>
      <div className="bg-foreground/10 border-foreground/20 rounded-lg border p-2 backdrop-blur-sm md:p-3">
        <div className="font-bold">{winPercentage}%</div>
        <div className="text-xs opacity-80 md:text-sm">Win %</div>
      </div>
      <div className="bg-foreground/10 border-foreground/20 rounded-lg border p-2 backdrop-blur-sm md:p-3">
        <div className="font-bold">{currentStreak}</div>
        <div className="text-xs opacity-80 md:text-sm">Streak</div>
      </div>
      <div className="bg-foreground/10 border-foreground/20 rounded-lg border p-2 backdrop-blur-sm md:p-3">
        <div className="font-bold">{maxStreak}</div>
        <div className="text-xs opacity-80 md:text-sm">Max Streak</div>
      </div>
      <div className="bg-foreground/10 border-foreground/20 col-span-2 rounded-lg border p-2 backdrop-blur-sm md:p-3">
        <div className="font-bold">{averageGuesses}</div>
        <div className="text-xs opacity-80 md:text-sm">Avg Guesses</div>
      </div>
    </div>
  );
}
