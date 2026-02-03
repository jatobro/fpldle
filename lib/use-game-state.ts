"use client";

import { GameStatus, Guess, Player } from "@/lib/definitions";
import { MAX_ATTEMPTS } from "@/lib/definitions";
import { comparePlayers } from "@/lib/game";
import {
  loadGameState,
  saveGameState,
} from "@/lib/storage";
import * as React from "react";

export interface UseGameStateReturn {
  guesses: Guess[];
  gameStatus: GameStatus;
  submitGuess: (player: Player) => void;
  resetGame: () => void;
  remainingAttempts: number;
}

export function useGameState(targetPlayer: Player): UseGameStateReturn {
  const [guesses, setGuesses] = React.useState<Guess[]>([]);
  const [gameStatus, setGameStatus] = React.useState<GameStatus>("playing");
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    const savedState = loadGameState(targetPlayer.id);
    if (savedState) {
      setGuesses(savedState.guesses);
      setGameStatus(savedState.gameStatus);
    }
    setIsLoaded(true);
  }, [targetPlayer.id]);

  React.useEffect(() => {
    if (isLoaded) {
      saveGameState(targetPlayer.id, guesses, gameStatus);
    }
  }, [guesses, gameStatus, targetPlayer.id, isLoaded]);

  const submitGuess = React.useCallback(
    (player: Player) => {
      if (gameStatus !== "playing") return;

      const attributes = comparePlayers(player, targetPlayer);
      const newGuess: Guess = {
        player,
        attributes,
      };

      setGuesses((prev) => {
        const newGuesses = [...prev, newGuess];
        if (player.id === targetPlayer.id) {
          setGameStatus("won");
        } else if (newGuesses.length >= MAX_ATTEMPTS) {
          setGameStatus("lost");
        }
        return newGuesses;
      });
    },
    [gameStatus, targetPlayer],
  );

  const resetGame = React.useCallback(() => {
    setGuesses([]);
    setGameStatus("playing");
    saveGameState(targetPlayer.id, [], "playing");
  }, [targetPlayer.id]);

  const remainingAttempts = MAX_ATTEMPTS - guesses.length;

  return {
    guesses,
    gameStatus,
    submitGuess,
    resetGame,
    remainingAttempts,
  };
}
