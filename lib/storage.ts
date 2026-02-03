import { GameStatus, Guess } from "./definitions";
import { getTodayDateString } from "./utils";

export interface StoredGameState {
  targetPlayerId: number;
  guesses: Guess[];
  gameStatus: GameStatus;
  completedAt: string | null;
}

export interface StorageData {
  [date: string]: StoredGameState;
}

const STORAGE_KEY = "fpldle-games";

export const saveGameState = (
  targetPlayerId: number,
  guesses: Guess[],
  gameStatus: GameStatus,
  date?: string,
): void => {
  if (typeof window === "undefined") return;

  const dateString = date || getTodayDateString();

  try {
    const existingData = loadAllGames();
    const completedAt =
      gameStatus !== "playing" ? new Date().toISOString() : null;

    existingData[dateString] = {
      targetPlayerId,
      guesses,
      gameStatus,
      completedAt,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
  } catch (error) {
    console.error("Failed to save game state:", error);
  }
};

export const loadGameState = (
  targetPlayerId: number,
  date?: string,
): StoredGameState | null => {
  if (typeof window === "undefined") return null;

  const dateString = date || getTodayDateString();

  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return null;

    const parsedData: StorageData = JSON.parse(storedData);
    const gameState = parsedData[dateString];

    if (!gameState) return null;

    if (gameState.targetPlayerId !== targetPlayerId) {
      delete parsedData[dateString];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedData));
      return null;
    }

    return gameState;
  } catch (error) {
    console.error("Failed to load game state:", error);
    return null;
  }
};

export const loadAllGames = (): StorageData => {
  if (typeof window === "undefined") return {};

  try {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (!storedData) return {};

    return JSON.parse(storedData);
  } catch (error) {
    console.error("Failed to load all games:", error);
    return {};
  }
};

export const clearOldGames = (daysToKeep: number = 30): void => {
  if (typeof window === "undefined") return;

  try {
    const data = loadAllGames();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const dates = Object.keys(data);
    dates.forEach((date) => {
      const gameDate = new Date(date);
      if (gameDate < cutoffDate) {
        delete data[date];
      }
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to clear old games:", error);
  }
};
