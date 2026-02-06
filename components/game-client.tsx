"use client";

import { GameFinishedCard } from "@/components/game-finished-card";
import { PlayerSearch } from "@/components/player-search";
import { Spinner } from "@/components/ui/spinner";
import { MAX_ATTEMPTS } from "@/lib/consts";
import { Player, AttributeKey } from "@/lib/definitions";
import { useGameState } from "@/lib/hooks";
import { getStatusColor, getDirectionArrow } from "@/lib/utils";

interface GameClientProps {
  players: Player[];
  dateString: string;
  targetPlayer: Player;
}

const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  position: "Position",
  team: "Team",
  price: "Price",
  form: "Form",
  points: "Points",
  selectedBy: "Selected By",
};

export const GameClient = ({
  players,
  dateString,
  targetPlayer,
}: GameClientProps) => {
  const { guesses, gameStatus, userStats, submitGuess, isLoaded } =
    useGameState(dateString, targetPlayer);

  if (!isLoaded)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-4 md:space-y-6">
      {gameStatus === "playing" && (
        <div className="space-y-3">
          <p className="text-sm md:text-base text-muted-foreground font-medium">
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
              className="border rounded-xl p-4 md:p-6 space-y-3 animate-in fade-in-0 slide-in-from-bottom-4 duration-200"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="text-lg md:text-xl font-bold">{guess.player.name}</div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 md:gap-3">
                {guess.attributes.map((attr) => (
                  <div
                    key={attr.key}
                    className={`${getStatusColor(
                      attr.status.correctness,
                    )} rounded-lg p-2 md:p-3 text-center transition-colors duration-200`}
                  >
                    <div className="text-xs md:text-sm opacity-80 mb-1">
                      {ATTRIBUTE_LABELS[attr.key]}
                    </div>
                    <div className="font-semibold text-sm md:text-base">
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
};
