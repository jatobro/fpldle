"use client";

import { PlayerSearch } from "@/components/player-search";
import { Spinner } from "@/components/ui/spinner";
import {
  Player,
  AttributeStatus,
  AttributeKey,
  MAX_ATTEMPTS,
} from "@/lib/definitions";
import { useGameState } from "@/lib/use-game-state";

interface GameClientProps {
  players: Player[];
  targetPlayer: Player;
}

const getStatusColor = (status: AttributeStatus): string => {
  switch (status) {
    case "correct":
      return "bg-green-500 text-white";
    case "close":
      return "bg-yellow-500 text-white";
    case "incorrect":
      return "bg-gray-300 text-gray-700";
  }
};

const ATTRIBUTE_LABELS: Record<AttributeKey, string> = {
  position: "Position",
  team: "Team",
  price: "Price",
  form: "Form",
  points: "Points",
  selectedBy: "Selected By",
};

const getDirectionArrow = (direction: "up" | "down" | null): string => {
  if (direction === "up") return "↑";
  if (direction === "down") return "↓";
  return "";
};

export function GameClient({ players, targetPlayer }: GameClientProps) {
  const { guesses, gameStatus, submitGuess, remainingAttempts, isLoaded } =
    useGameState(targetPlayer);

  if (!isLoaded)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Attempts remaining: {remainingAttempts}
      </p>
      {gameStatus === "playing" && (
        <PlayerSearch players={players} onPlayerSelect={submitGuess} />
      )}

      {guesses.length > 0 && (
        <div className="space-y-2">
          {guesses.map((guess, index) => (
            <div
              key={`${guess.player.id}-${index}`}
              className="border rounded-lg p-4 space-y-2"
            >
              <div className="text-lg font-semibold">{guess.player.name}</div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                {guess.attributes.map((attr) => (
                  <div
                    key={attr.key}
                    className={`${getStatusColor(
                      attr.status,
                    )} rounded-md p-2 text-center`}
                  >
                    <div className="text-xs opacity-80">
                      {ATTRIBUTE_LABELS[attr.key]}
                    </div>
                    <div className="font-medium">
                      {attr.key === "price"
                        ? `£${guess.player.price.toFixed(1)}m ${getDirectionArrow(attr.direction)}`
                        : attr.key === "selectedBy"
                          ? `${guess.player.selectedBy.toFixed(1)}% ${getDirectionArrow(attr.direction)}`
                          : `${guess.player[attr.key]} ${getDirectionArrow(attr.direction)}`}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {gameStatus === "won" && (
        <div className="text-center p-8 bg-green-500 text-white rounded-lg">
          <h2 className="text-3xl font-bold mb-2">🎉 You Won!</h2>
          <p className="text-xl">The player was {targetPlayer.name}</p>
          <p className="text-lg mt-2">
            {MAX_ATTEMPTS - remainingAttempts} / {MAX_ATTEMPTS} attempts
          </p>
        </div>
      )}

      {gameStatus === "lost" && (
        <div className="text-center p-8 bg-red-500 text-white rounded-lg">
          <h2 className="text-3xl font-bold mb-2">Game Over</h2>
          <p className="text-xl">The player was {targetPlayer.name}</p>
        </div>
      )}
    </div>
  );
}
