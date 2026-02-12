"use client";

import { CustomSpinner } from "./custom-spinner";
import { GameFinishedCard } from "@/components/game-finished-card";
import { PlayerSearch } from "@/components/player-search";
import { MAX_ATTEMPTS } from "@/lib/consts";
import { Player, AttributeKey } from "@/lib/definitions";
import { useGameState } from "@/lib/hooks";
import { getStatusColor, getDirectionArrow } from "@/lib/utils";

interface GameClientProps {
  players: Player[];
  dateString: string;
}

const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  position: "Position",
  team: "Team",
  price: "Price",
  form: "Form",
  points: "Points",
  selectedBy: "Selected By",
};

export function GameClient({ players, dateString }: GameClientProps) {
  const {
    targetPlayer,
    guesses,
    gameStatus,
    userStats,
    isLoading,
    submitGuess,
  } = useGameState(players, dateString);

  if (isLoading)
    return (
      <div className="flex justify-center">
        <CustomSpinner />
      </div>
    );

  return (
    <div className="space-y-4 md:space-y-6">
      {gameStatus === "playing" && (
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm font-medium md:text-base">
            Attempts remaining: {MAX_ATTEMPTS - guesses.length}
          </p>
          <div className="flex justify-center">
            <PlayerSearch
              players={players}
              guesses={guesses}
              onPlayerSelect={submitGuess}
            />
          </div>
        </div>
      )}

      {(gameStatus === "won" || gameStatus === "lost") && (
        <GameFinishedCard
          status={gameStatus}
          targetPlayer={targetPlayer}
          guesses={guesses}
          userStats={userStats}
        />
      )}

      {guesses.length > 0 && (
        <div className="space-y-3 md:space-y-4">
          {guesses.map((guess, index) => (
            <div
              key={`${guess.player.id}-${index}`}
              className="animate-in fade-in-0 slide-in-from-bottom-4 space-y-3 rounded-xl border p-4 duration-200 md:p-6"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-lg font-bold md:text-xl">
                {guess.player.name}
              </div>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-6">
                {guess.attributes.map((attr) => (
                  <div
                    key={attr.key}
                    className={`${getStatusColor(
                      attr.status.correctness,
                    )} rounded-lg p-2 text-center transition-colors duration-200 md:p-3`}
                  >
                    <div className="mb-1 text-xs opacity-80 md:text-sm">
                      {ATTRIBUTE_LABELS[attr.key]}
                    </div>
                    <div className="text-sm font-semibold md:text-base">
                      {attr.key === "price"
                        ? `£${guess.player.price.toFixed(1)}m ${getDirectionArrow(attr.status.direction)}`
                        : attr.key === "selectedBy"
                          ? `${guess.player.selectedBy.toFixed(1)}% ${getDirectionArrow(attr.status.direction)}`
                          : `${guess.player[attr.key]} ${getDirectionArrow(attr.status.direction)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
