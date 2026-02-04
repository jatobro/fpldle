"use client";

import { GameFinishedCard } from "@/components/game-finished-card";
import { PlayerSearch } from "@/components/player-search";
import { Spinner } from "@/components/ui/spinner";
import { MAX_ATTEMPTS } from "@/lib/consts";
import { Player, AttributeKey } from "@/lib/definitions";
import { useGameState } from "@/lib/hooks";
import { loadAllGames } from "@/lib/storage";
import {
  getYesterdayDateString,
  getStatusColor,
  getDirectionArrow,
} from "@/lib/utils";
import * as React from "react";

interface GameClientProps {
  players: Player[];
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

export const GameClient = ({ players, targetPlayer }: GameClientProps) => {
  const { guesses, gameStatus, submitGuess, isLoaded } =
    useGameState(targetPlayer);

  const [yesterdayPlayer, setYesterdayPlayer] = React.useState<Player | null>(
    null,
  );

  React.useEffect(() => {
    const allGames = loadAllGames();
    const yesterdayDate = getYesterdayDateString();
    const yesterdayGameState = allGames[yesterdayDate];

    if (yesterdayGameState?.targetPlayerId) {
      const player = players.find(
        (p) => p.id === yesterdayGameState.targetPlayerId,
      );
      if (player) {
        setYesterdayPlayer(player);
      }
    }
  }, [players]);

  if (!isLoaded)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );

  return (
    <div className="space-y-3">
      {gameStatus === "playing" && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
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
        />
      )}

      {guesses.length > 0 && (
        <div className="space-y-3">
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
};
