export const MAX_ATTEMPTS = 6;

export type Position = "GK" | "DEF" | "MID" | "FWD";

export type Team =
  | "Arsenal"
  | "Aston Villa"
  | "Bournemouth"
  | "Brentford"
  | "Brighton"
  | "Burnley"
  | "Chelsea"
  | "Crystal Palace"
  | "Everton"
  | "Fulham"
  | "Leeds"
  | "Liverpool"
  | "Man City"
  | "Man Utd"
  | "Newcastle"
  | "Nott'm Forest"
  | "Spurs"
  | "Sunderland"
  | "West Ham"
  | "Wolves";

export type AttributeKey =
  | "position"
  | "team"
  | "price"
  | "nationality"
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
  nationality: string;
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
