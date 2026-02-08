"use client";

import { MAX_ATTEMPTS } from "@/lib/consts";
import { GameStatus, Guess, Player, UserStats } from "@/lib/definitions";
import { comparePlayers } from "@/lib/game";
import { loadUserStats, loadGameState, saveGameState } from "@/lib/storage";
import * as React from "react";

interface UseGameStateReturn {
  guesses: Guess[];
  gameStatus: GameStatus;
  userStats: UserStats | null;
  submitGuess: (player: Player) => void;
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
    const savedState = loadGameState(dateString);
    const stats = loadUserStats();
    if (savedState) {
      setGuesses(savedState.guesses);
      setGameStatus(savedState.gameStatus);
    }
    setUserStats(stats);
    setIsLoaded(true);
  }, [dateString, targetPlayer.id]);

  React.useEffect(() => {
    if (isLoaded)
      saveGameState(dateString, targetPlayer.id, guesses, gameStatus);
  }, [isLoaded, dateString, targetPlayer.id, guesses, gameStatus]);

  React.useEffect(() => {
    if (gameStatus === "won" || gameStatus === "lost") {
      const newStats = loadUserStats();
      setUserStats(newStats);
    }
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

      const newGuesses = [newGuess, ...guesses];
      let newGameStatus: GameStatus = gameStatus;

      if (player.id === targetPlayer.id) {
        newGameStatus = "won";
      } else if (newGuesses.length >= MAX_ATTEMPTS) {
        newGameStatus = "lost";
      }

      setGuesses(newGuesses);
      if (newGameStatus !== gameStatus) setGameStatus(newGameStatus);
    },
    [gameStatus, targetPlayer, guesses],
  );

  return {
    guesses,
    gameStatus,
    userStats,
    submitGuess,
    isLoaded,
  };
}
