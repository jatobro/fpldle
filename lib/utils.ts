import { POSITION_ORDER, POSITION_MAP, MAX_ATTEMPTS } from "./consts";
import {
  Team,
  Position,
  Player,
  FPLApiResponse,
  Guess,
  GameStatus,
  Correctness,
  Direction,
} from "./definitions";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const transformFPLData = (data: FPLApiResponse): Player[] => {
  const { teams, elements } = data;

  const teamMap = new Map<number, Team>(
    teams.map((team) => [team.id, team.name as Team]),
  );

  return elements.map((player) => ({
    id: player.id,
    name: player.web_name,
    position: POSITION_MAP[player.element_type] || "MID",
    team: teamMap.get(player.team) || "Arsenal",
    price: player.now_cost / 10,
    form: parseFloat(player.form) || 0,
    points: player.total_points,
    selectedBy: parseFloat(player.selected_by_percent) || 0,
  }));
};

// ui helpers

export const isPositionAdjacent = (guess: Position, target: Position) =>
  Math.abs(POSITION_ORDER[guess] - POSITION_ORDER[target]) === 1;

export const getDirectionArrow = (direction: Direction): string => {
  if (direction === "up") return "↑";
  if (direction === "down") return "↓";
  return "";
};

export const getStatusColor = (correctness: Correctness) => {
  switch (correctness) {
    case "correct":
      return "bg-green-500 text-white";
    case "close":
      return "bg-yellow-500 text-white";
    case "incorrect":
      return "bg-gray-300 text-gray-700";
  }
};

// share text

const getGameNumber = () => {
  const launchDate = new Date("2025-01-01");
  const today = new Date();
  const diffTime = today.getTime() - launchDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
};

const correctnessEmoji = (correctness: Correctness) => {
  switch (correctness) {
    case "correct":
      return "🟩";
    case "close":
      return "🟨";
    case "incorrect":
      return "⬜";
    default:
      return "⬜";
  }
};

export const generateShareText = (gameStatus: GameStatus, guesses: Guess[]) => {
  let result = `FPLdle #${getGameNumber()} `;

  if (gameStatus === "won") {
    result += `${guesses.length}/${MAX_ATTEMPTS}`;
  } else {
    result += `X/${MAX_ATTEMPTS}`;
  }

  result += "\n\n";

  guesses.forEach((guess) => {
    guess.attributes.forEach((attr) => {
      result += correctnessEmoji(attr.status.correctness);
    });
    result += "\n";
  });

  result += `\n${process.env.NEXT_PUBLIC_APP_URL}`;

  return result;
};
