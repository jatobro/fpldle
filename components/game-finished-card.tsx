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

  const handleShare = async () => {
    const shareText = generateShareText(status, guesses);
    try {
      await navigator.clipboard.writeText(shareText);
      setShareFeedback(true);
      setTimeout(() => setShareFeedback(false), 2000);
    } catch (error) {
      console.error(error);
      alert("Failed to copy to clipboard");
    }
  };

  return (
    <div
      className={`p-6 text-center md:p-8 ${bgColor} ${textColor} rounded-xl shadow-lg`}
    >
      <h2 className="mb-3 text-3xl font-bold md:text-4xl">{heading}</h2>
      <p className="text-lg md:text-xl">The player was {targetPlayer.name}</p>
      {status === "won" && (
        <p className="mt-2 text-base font-medium md:text-lg">
          {guesses.length} / {MAX_ATTEMPTS} attempts
        </p>
      )}
      {userStats && <StatsDisplay userStats={userStats} />}
      <Button
        onClick={handleShare}
        className={`bg-background text-foreground mt-4 rounded-lg px-6 py-2 font-semibold transition-opacity hover:opacity-90 md:px-8 md:py-3`}
      >
        {shareFeedback ? "Copied!" : "Share FPLdle"}
      </Button>
    </div>
  );
};
