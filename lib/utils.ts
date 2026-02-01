import { POSITION_MAP, TEAMS } from "./consts";
import type {
  Attribute,
  AttributeStatus,
  Player,
  Position,
  Team,
  FPLPlayer,
  FPLTeam,
} from "./definitions";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const transformPlayer = (
  player: FPLPlayer,
  teamMap: Map<number, Team>,
): Player => {
  return {
    id: player.id,
    name: player.web_name,
    position: POSITION_MAP[player.element_type] || "MID",
    team: teamMap.get(player.team) || "Arsenal",
    price: player.now_cost / 10,
    form: parseFloat(player.form) || 0,
    points: player.total_points,
    selectedBy: parseFloat(player.selected_by_percent) || 0,
  };
};

export const validatePlayers = (players: Player[]) => {
  const errors: string[] = [];

  if (players.length < 100) {
    errors.push(`Too few players: ${players.length} (expected more than 100)`);
  }

  players.forEach((player) => {
    if (player.name.length === 0) {
      errors.push(`Player ${player.id} has empty name`);
    }

    if (!TEAMS.includes(player.team)) {
      errors.push(`Player ${player.name} has invalid team: ${player.team}`);
    }
    if (!["GK", "DEF", "MID", "FWD"].includes(player.position)) {
      errors.push(
        `Player ${player.name} has invalid position: ${player.position}`,
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

export const validateTeams = (
  teams: FPLTeam[],
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const apiTeamNames = new Set(teams.map((t) => t.name));

  TEAMS.forEach((validTeam) => {
    if (!apiTeamNames.has(validTeam)) {
      errors.push(`Missing team: ${validTeam}`);
    }
  });

  apiTeamNames.forEach((apiTeam) => {
    if (!TEAMS.includes(apiTeam as Team)) {
      errors.push(`Unexpected team in API: ${apiTeam}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

// Comparison Logic

const POSITION_ORDER = {
  GK: 1,
  DEF: 2,
  MID: 3,
  FWD: 4,
};

const isPositionAdjacent = (guess: Position, target: Position) =>
  Math.abs(POSITION_ORDER[guess] - POSITION_ORDER[target]) === 1;

const comparePosition = (
  guess: Position,
  target: Position,
): AttributeStatus => {
  if (guess === target) return "correct";
  if (isPositionAdjacent(guess, target)) return "close";
  return "incorrect";
};

const compareTeam = (guess: Team, target: Team): AttributeStatus =>
  guess === target ? "correct" : "incorrect";

const comparePrice = (guess: number, target: number): AttributeStatus => {
  if (guess === target) return "correct";
  const isClose = Math.abs(guess - target) <= 0.5;
  return isClose ? "close" : "incorrect";
};

const compareForm = (guess: number, target: number): AttributeStatus => {
  if (guess === target) return "correct";
  const isClose = Math.abs(guess - target) <= 1.0;
  return isClose ? "close" : "incorrect";
};

const comparePoints = (guess: number, target: number): AttributeStatus => {
  if (guess === target) return "correct";
  const isClose = Math.abs(guess - target) <= 10;
  return isClose ? "close" : "incorrect";
};

const compareSelectedBy = (guess: number, target: number): AttributeStatus => {
  if (guess === target) return "correct";
  const isClose = Math.abs(guess - target) <= 5;
  return isClose ? "close" : "incorrect";
};

export const getDirection = (guess: number, target: number) =>
  guess > target ? "↓" : guess < target ? "↑" : "";

export const comparePlayers = (guess: Player, target: Player): Attribute[] => [
  {
    key: "position",
    label: "Position",
    value: guess.position,
    status: comparePosition(guess.position, target.position),
  },
  {
    key: "team",
    label: "Team",
    value: guess.team,
    status: compareTeam(guess.team, target.team),
  },
  {
    key: "price",
    label: "Price",
    value: guess.price,
    status: comparePrice(guess.price, target.price),
  },
  {
    key: "form",
    label: "Form",
    value: guess.form,
    status: compareForm(guess.form, target.form),
  },
  {
    key: "points",
    label: "Points",
    value: guess.points,
    status: comparePoints(guess.points, target.points),
  },
  {
    key: "selectedBy",
    label: "Selected By",
    value: guess.selectedBy,
    status: compareSelectedBy(guess.selectedBy, target.selectedBy),
  },
];

// Daily Player Selection

const cyrb128 = (str: string) => {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;

  for (let i = 0; i < str.length; i++) {
    const k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }

  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);

  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
};

const sfc32 = (a: number, b: number, c: number, d: number) => {
  return () => {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
};

export const getDailyPlayer = (players: Player[], date: Date): Player => {
  const activePlayers = players.filter((p) => p.selectedBy > 0);

  const dateString = date.toISOString().split("T")[0];
  const seed = cyrb128(dateString);

  const a = seed;
  const b = 123456789;
  const c = 362436069;
  const d = 521288629;

  const random = sfc32(a, b, c, d);

  const maxId = Math.max(...activePlayers.map((p) => p.id));
  const randomId = Math.floor(random() * maxId);

  const exactPlayer = activePlayers.find((p) => p.id === randomId);

  if (exactPlayer) {
    return exactPlayer;
  }

  const fallbackPlayer = activePlayers.find((p) => p.id >= randomId);
  return fallbackPlayer || activePlayers[0];
};
