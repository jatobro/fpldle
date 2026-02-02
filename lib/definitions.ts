export const MAX_ATTEMPTS = 6;

export const TEAMS = [
  "Arsenal",
  "Aston Villa",
  "Bournemouth",
  "Brentford",
  "Brighton",
  "Burnley",
  "Chelsea",
  "Crystal Palace",
  "Everton",
  "Fulham",
  "Leeds",
  "Liverpool",
  "Man City",
  "Man Utd",
  "Newcastle",
  "Nott'm Forest",
  "Spurs",
  "Sunderland",
  "West Ham",
  "Wolves",
] as const;

export type Team = (typeof TEAMS)[number];

export type Position = "GK" | "DEF" | "MID" | "FWD";

export type AttributeKey =
  | "position"
  | "team"
  | "price"
  | "form"
  | "points"
  | "selectedBy";

export type AttributeStatus = "correct" | "close" | "incorrect";

export interface Attribute {
  key: AttributeKey;
  label: string;
  value: string | number;
  status: AttributeStatus;
}

export interface Player {
  id: number;
  name: string;
  position: Position;
  team: Team;
  price: number;
  form: number;
  points: number;
  selectedBy: number;
}

export interface Guess {
  player: Player;
  attributes: Attribute[];
}

export type GameStatus = "playing" | "won" | "lost";

export interface GameState {
  targetPlayer: Player;
  guesses: Guess[];
  gameStatus: GameStatus;
  date: string;
}

export interface FPLTeam {
  id: number;
  name: string;
  short_name: string;
}

export interface FPLPlayer {
  id: number;
  web_name: string;
  element_type: number;
  team: number;
  now_cost: number;
  nation: string;
  form: string;
  total_points: number;
  selected_by_percent: string;
}

export interface FPLApiResponse {
  teams: FPLTeam[];
  elements: FPLPlayer[];
}
