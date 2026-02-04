"use client";

import { PlayerSearch } from "@/components/player-search";
import { Spinner } from "@/components/ui/spinner";
import { MAX_ATTEMPTS } from "@/lib/consts";
import { Player, AttributeKey, UserStats } from "@/lib/definitions";
import { useGameState } from "@/lib/hooks";
import { loadAllGames, getUserStats } from "@/lib/storage";
import {
  getYesterdayDateString,
  generateShareText,
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

const StatsDisplay = ({ userStats }: { userStats: UserStats }) => (
  <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
    <div className="bg-white/20 rounded-lg p-2">
      <div className="font-bold">{userStats.gamesPlayed}</div>
      <div className="opacity-80">Played</div>
    </div>
    <div className="bg-white/20 rounded-lg p-2">
      <div className="font-bold">{userStats.winPercentage}%</div>
      <div className="opacity-80">Win %</div>
    </div>
    <div className="bg-white/20 rounded-lg p-2">
      <div className="font-bold">{userStats.currentStreak}</div>
      <div className="opacity-80">Streak</div>
    </div>
    <div className="bg-white/20 rounded-lg p-2">
      <div className="font-bold">{userStats.maxStreak}</div>
      <div className="opacity-80">Max Streak</div>
    </div>
    <div className="bg-white/20 rounded-lg p-2 col-span-2">
      <div className="font-bold">{userStats.averageGuesses}</div>
      <div className="opacity-80">Avg Guesses</div>
    </div>
  </div>
);

export function GameClient({ players, targetPlayer }: GameClientProps) {
  const { guesses, gameStatus, submitGuess, isLoaded } =
    useGameState(targetPlayer);

  const [yesterdayPlayer, setYesterdayPlayer] = React.useState<Player | null>(
    null,
  );
  const [userStats, setUserStats] = React.useState<UserStats | null>(null);
  const [shareFeedback, setShareFeedback] = React.useState(false);

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

  React.useEffect(() => {
    if (gameStatus === "won" || gameStatus === "lost") {
      setUserStats(getUserStats());
    }
  }, [gameStatus]);

  const handleShare = () => {
    const shareText = generateShareText(gameStatus, guesses);
    navigator.clipboard.writeText(shareText);
    setShareFeedback(true);
    setTimeout(() => setShareFeedback(false), 2000);
  };

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
          {userStats && <StatsDisplay userStats={userStats} />}
          <button
            onClick={handleShare}
            className="mt-4 bg-white text-green-600 font-semibold py-2 px-6 rounded-lg hover:bg-green-50 transition-colors"
          >
            {shareFeedback ? "Copied!" : "Share"}
          </button>
        </div>
      )}

      {gameStatus === "lost" && (
        <div className="text-center p-8 bg-red-500 text-white rounded-lg">
          <h2 className="text-3xl font-bold mb-2">Game Over</h2>
          <p className="text-xl">The player was {targetPlayer.name}</p>
          {userStats && <StatsDisplay userStats={userStats} />}
          <button
            onClick={handleShare}
            className="mt-4 bg-white text-red-600 font-semibold py-2 px-6 rounded-lg hover:bg-red-50 transition-colors"
          >
            {shareFeedback ? "Copied!" : "Share"}
          </button>
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
