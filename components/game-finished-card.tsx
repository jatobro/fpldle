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
    bgColor: "bg-green-500",
    textColor: "text-green-600",
    hoverColor: "hover:bg-green-50",
    heading: "🎉 You Won!",
  },
  lost: {
    bgColor: "bg-red-500",
    textColor: "text-red-600",
    hoverColor: "hover:bg-red-50",
    heading: "Game Over",
  },
} as const;

export const GameFinishedCard = ({
  status,
  targetPlayer,
  guesses,
  userStats,
}: GameFinishedCardProps) => {
  const { bgColor, textColor, hoverColor, heading } = config[status];

  const [shareFeedback, setShareFeedback] = React.useState(false);

  const handleShare = () => {
    const shareText = generateShareText(status, guesses);
    navigator.clipboard.writeText(shareText);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2000);
  };

  return (
    <div className={`text-center p-8 ${bgColor} text-white rounded-lg`}>
      <h2 className="text-3xl font-bold mb-2">{heading}</h2>
      <p className="text-xl">The player was {targetPlayer.name}</p>
      {status === "won" && (
        <p className="text-lg mt-2">
          {guesses.length} / {MAX_ATTEMPTS} attempts
        </p>
      )}
      {userStats && <StatsDisplay userStats={userStats} />}
      <Button
        onClick={handleShare}
        className={`mt-4 bg-white ${textColor} font-semibold py-2 px-6 rounded-lg ${hoverColor} transition-colors`}
      >
        {shareFeedback ? "Copied!" : "Share FPLdle"}
      </Button>
    </div>
  );
};
