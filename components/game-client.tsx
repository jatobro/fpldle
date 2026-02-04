"use client";

import { PlayerSearch } from "@/components/player-search";
import { Spinner } from "@/components/ui/spinner";
import { MAX_ATTEMPTS } from "@/lib/consts";
import { Direction } from "@/lib/definitions";
import { Player, AttributeKey, Correctness } from "@/lib/definitions";
import { getYesterdayDateString } from "@/lib/utils";
import { loadAllGames } from "@/lib/storage";
import { useGameState } from "@/lib/hooks";
import * as React from "react";

interface GameClientProps {
  players: Player[];
  targetPlayer: Player;
}

const getStatusColor = (correctness: Correctness) => {
  switch (correctness) {
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

const getDirectionArrow = (direction: Direction): string => {
  if (direction === "up") return "↑";
  if (direction === "down") return "↓";
  return "";
};

export function GameClient({ players, targetPlayer }: GameClientProps) {
  const { guesses, gameStatus, submitGuess, isLoaded } =
    useGameState(targetPlayer);

  const [yesterdayPlayer, setYesterdayPlayer] = React.useState<Player | null>(null);

  React.useEffect(() => {
    const allGames = loadAllGames();
    const yesterdayDate = getYesterdayDateString();
    const yesterdayGameState = allGames[yesterdayDate];

    if (yesterdayGameState?.targetPlayerId) {
      const player = players.find((p) => p.id === yesterdayGameState.targetPlayerId);
      if (player) {
        setYesterdayPlayer(player);
      }
    }
  }, [players]);

  const guessedPlayerIds = React.useMemo(
    () => new Set(guesses.map((guess) => guess.player.id)),
    [guesses],
  );

  if (!isLoaded)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-2">
      <p className="text-sm text-muted-foreground">
        Attempts remaining: {MAX_ATTEMPTS - guesses.length}
      </p>

      {gameStatus === "playing" && (
        <div className="flex justify-center w-full">
          <PlayerSearch
            players={players}
            onPlayerSelect={submitGuess}
            guessedPlayerIds={guessedPlayerIds}
          />
        </div>
      )}

      {gameStatus === "won" && (
        <div className="text-center p-8 bg-green-500 text-white rounded-lg">
          <h2 className="text-3xl font-bold mb-2">🎉 You Won!</h2>
          <p className="text-xl">The player was {targetPlayer.name}</p>
          <p className="text-lg mt-2">
            {guesses.length} / {MAX_ATTEMPTS} attempts
          </p>
        </div>
      )}

      {gameStatus === "lost" && (
        <div className="text-center p-8 bg-red-500 text-white rounded-lg">
          <h2 className="text-3xl font-bold mb-2">Game Over</h2>
          <p className="text-xl">The player was {targetPlayer.name}</p>
        </div>
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
                      attr.status.correctness,
                    )} rounded-md p-2 text-center`}
                  >
                    <div className="text-xs opacity-80">
                      {ATTRIBUTE_LABELS[attr.key]}
                    </div>
                    <div className="font-medium">
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

      {yesterdayPlayer && (
        <p className="text-sm text-muted-foreground text-center">
          Yesterday&apos;s player was {yesterdayPlayer.name}
        </p>
      )}
    </div>
  );
}
