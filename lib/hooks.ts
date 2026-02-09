"use client";

import { MAX_ATTEMPTS } from "@/lib/consts";
import { GameStatus, Guess, Player, UserStats } from "@/lib/definitions";
import { comparePlayers, getTargetPlayer } from "@/lib/game";
import { loadUserStats, loadGameState, saveGameState } from "@/lib/storage";
import * as React from "react";

interface UseGameStateReturn {
  targetPlayer: Player;
  guesses: Guess[];
  gameStatus: GameStatus;
  userStats: UserStats | null;
  isLoading: boolean;
  submitGuess: (player: Player) => void;
}

export function useGameState(
  players: Player[],
  dateString: string,
): UseGameStateReturn {
  const [guesses, setGuesses] = React.useState<Guess[]>([]);
  const [gameStatus, setGameStatus] = React.useState<GameStatus>("playing");
  const [userStats, setUserStats] = React.useState<UserStats | null>(
    loadUserStats(),
  );
  const [isLoading, setIsLoading] = React.useState(true);
  const hasLoadedRef = React.useRef(false);
  const prevGameStatusRef = React.useRef(gameStatus);

  const targetPlayer = React.useMemo(
    () => getTargetPlayer(players, dateString),
    [players, dateString],
  );

  React.useEffect(() => {
    const storedState = loadGameState(dateString);
    if (storedState) {
      setGuesses(storedState.guesses);
      setGameStatus(storedState.gameStatus);
      if (storedState.gameStatus === "won" || storedState.gameStatus === "lost")
        setUserStats(loadUserStats());
    }

    setIsLoading(false);
  }, [dateString]);

  React.useEffect(() => {
    if (hasLoadedRef.current) saveGameState(dateString, guesses, gameStatus);
    hasLoadedRef.current = true;
  }, [dateString, guesses, gameStatus]);

  React.useEffect(() => {
    if (
      prevGameStatusRef.current === "playing" &&
      (gameStatus === "won" || gameStatus === "lost")
    )
      setUserStats(loadUserStats());

    prevGameStatusRef.current = gameStatus;
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
    targetPlayer,
    guesses,
    gameStatus,
    userStats,
    isLoading,
    submitGuess,
  };
}
