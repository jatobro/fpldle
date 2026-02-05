"use client";

import { MAX_ATTEMPTS } from "@/lib/consts";
import { GameStatus, Guess, Player, UserStats } from "@/lib/definitions";
import { comparePlayers } from "@/lib/game";
import { getUserStats, loadGameState, saveGameState } from "@/lib/storage";
import * as React from "react";

interface UseGameStateReturn {
  guesses: Guess[];
  gameStatus: GameStatus;
  userStats: UserStats | null;
  submitGuess: (player: Player) => void;
  resetGame: () => void;
  isLoaded: boolean;
}

export function useGameState(
  dateString: string,
  targetPlayer: Player,
): UseGameStateReturn {
  const [guesses, setGuesses] = React.useState<Guess[]>([]);
  const [gameStatus, setGameStatus] = React.useState<GameStatus>("playing");
  const [userStats, setUserStats] = React.useState<UserStats | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const savedState = loadGameState(dateString, targetPlayer.id);
    if (savedState) {
      setGuesses(savedState.guesses);
      setGameStatus(savedState.gameStatus);
    }
    setUserStats(getUserStats());
    setIsLoaded(true);
  }, [dateString, targetPlayer.id]);

  React.useEffect(() => {
    if (isLoaded)
      saveGameState(dateString, targetPlayer.id, guesses, gameStatus);
  }, [isLoaded, dateString, targetPlayer.id, guesses, gameStatus]);

  React.useEffect(() => {
    if (gameStatus === "won" || gameStatus === "lost")
      setUserStats(getUserStats());
  }, [gameStatus]);

  const submitGuess = React.useCallback(
    (player: Player) => {
      if (gameStatus !== "playing") return;

      const isDuplicate = guesses.some(
        (guess) => guess.player.id === player.id,
      );
      if (isDuplicate) return;

      const attributes = comparePlayers(player, targetPlayer);
      const newGuess: Guess = {
        player,
        attributes,
      };

      setGuesses((prev) => {
        const newGuesses = [newGuess, ...prev];
        if (player.id === targetPlayer.id) {
          setGameStatus("won");
        } else if (newGuesses.length >= MAX_ATTEMPTS) {
          setGameStatus("lost");
        }
        return newGuesses;
      });
    },
    [gameStatus, targetPlayer, guesses],
  );

  const resetGame = React.useCallback(() => {
    setGuesses([]);
    setGameStatus("playing");
    saveGameState(dateString, targetPlayer.id, [], "playing");
  }, [dateString, targetPlayer.id]);

  return {
    guesses,
    gameStatus,
    userStats,
    submitGuess,
    resetGame,
    isLoaded,
  };
}
