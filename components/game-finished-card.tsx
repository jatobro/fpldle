import { StatsDisplay } from "./stats-display";
import { Button } from "./ui/button";
import { MAX_ATTEMPTS } from "@/lib/consts";
import { Player, Guess, UserStats } from "@/lib/definitions";
import { generateShareText } from "@/lib/utils";
import React from "react";

interface GameFinishedCardProps {
  status: "won" | "lost";
  targetPlayer: Player;
  guesses: Guess[];
  userStats: UserStats | null;
}

const config = {
  won: {
    bgColor: "bg-[var(--game-correct)]",
    textColor: "text-[var(--game-correct-foreground)]",
    heading: "🎉 You Won!",
  },
  lost: {
    bgColor: "bg-[var(--game-incorrect)]",
    textColor: "text-[var(--game-incorrect-foreground)]",
    heading: "Game Over",
  },
} as const;

export const GameFinishedCard = ({
  status,
  targetPlayer,
  guesses,
  userStats,
}: GameFinishedCardProps) => {
  const { bgColor, textColor, heading } = config[status];

  const [shareFeedback, setShareFeedback] = React.useState(false);

  const handleShare = () => {
    const shareText = generateShareText(status, guesses);
    navigator.clipboard.writeText(shareText);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2000);
  };

  return (
    <div className={`text-center p-6 md:p-8 ${bgColor} ${textColor} rounded-xl shadow-lg`}>
      <h2 className="text-3xl md:text-4xl font-bold mb-3">{heading}</h2>
      <p className="text-lg md:text-xl">The player was {targetPlayer.name}</p>
      {status === "won" && (
        <p className="text-base md:text-lg mt-2 font-medium">
          {guesses.length} / {MAX_ATTEMPTS} attempts
        </p>
      )}
      {userStats && <StatsDisplay userStats={userStats} />}
      <Button
        onClick={handleShare}
        className={`mt-4 bg-background text-foreground font-semibold py-2 md:py-3 px-6 md:px-8 rounded-lg hover:opacity-90 transition-opacity`}
      >
        {shareFeedback ? "Copied!" : "Share FPLdle"}
      </Button>
    </div>
  );
};
