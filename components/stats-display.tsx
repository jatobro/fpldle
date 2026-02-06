import { UserStats } from "@/lib/definitions";

export const StatsDisplay = ({ userStats }: { userStats: UserStats }) => {
  const {
    gamesPlayed,
    winPercentage,
    currentStreak,
    maxStreak,
    averageGuesses,
  } = userStats;

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-3 mt-4 md:mt-6 text-sm md:text-base">
      <div className="bg-foreground/10 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-foreground/20">
        <div className="font-bold">{gamesPlayed}</div>
        <div className="opacity-80 text-xs md:text-sm">Played</div>
      </div>
      <div className="bg-foreground/10 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-foreground/20">
        <div className="font-bold">{winPercentage}%</div>
        <div className="opacity-80 text-xs md:text-sm">Win %</div>
      </div>
      <div className="bg-foreground/10 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-foreground/20">
        <div className="font-bold">{currentStreak}</div>
        <div className="opacity-80 text-xs md:text-sm">Streak</div>
      </div>
      <div className="bg-foreground/10 backdrop-blur-sm rounded-lg p-2 md:p-3 border border-foreground/20">
        <div className="font-bold">{maxStreak}</div>
        <div className="opacity-80 text-xs md:text-sm">Max Streak</div>
      </div>
      <div className="bg-foreground/10 backdrop-blur-sm rounded-lg p-2 md:p-3 col-span-2 border border-foreground/20">
        <div className="font-bold">{averageGuesses}</div>
        <div className="opacity-80 text-xs md:text-sm">Avg Guesses</div>
      </div>
    </div>
  );
};
