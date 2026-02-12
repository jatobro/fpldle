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

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function transformFPLData(data: FPLApiResponse): Player[] {
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
    photo: `p${player.photo.replace(".jpg", ".png")}`,
  }));
}

// ui helpers

export function isPositionAdjacent(guess: Position, target: Position) {
  return Math.abs(POSITION_ORDER[guess] - POSITION_ORDER[target]) === 1;
}

export function getDirectionArrow(direction: Direction): string {
  if (direction === "up") return "↑";
  if (direction === "down") return "↓";
  return "";
}

export function getStatusColor(correctness: Correctness) {
  switch (correctness) {
    case "correct":
      return "bg-[var(--game-correct)] text-[var(--game-correct-foreground)]";
    case "close":
      return "bg-[var(--game-close)] text-[var(--game-close-foreground)]";
    case "incorrect":
      return "bg-[var(--game-incorrect)] text-[var(--game-incorrect-foreground)]";
  }
}

// player image

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// share text

function getGameNumber() {
  const launchDate = new Date(2026, 2, 13);
  const today = new Date();
  const diffTime = today.getTime() - launchDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1;
}

function correctnessEmoji(correctness: Correctness) {
  switch (correctness) {
    case "correct":
      return "🟩";
    case "close":
      return "🟨";
    case "incorrect":
      return "⬜";
  }
}

export function generateShareText(gameStatus: GameStatus, guesses: Guess[]) {
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

  if (process.env.NEXT_PUBLIC_APP_URL)
    result += `\n${process.env.NEXT_PUBLIC_APP_URL}`;

  return result;
}
