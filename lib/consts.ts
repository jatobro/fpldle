import { Position } from "./definitions";

// config

export const MAX_ATTEMPTS = 10;

// fpl api

export const FPL_API_URL =
  "https://fantasy.premierleague.com/api/bootstrap-static/";

export const FPL_PLAYER_IMG_BASE_URL =
  "https://resources.premierleague.com/premierleague/photos/players/250x250/";

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

// relations

export const POSITION_MAP: Record<number, Position> = {
  1: "GK",
  2: "DEF",
  3: "MID",
  4: "FWD",
};

export const POSITION_ORDER = {
  GK: 1,
  DEF: 2,
  MID: 3,
  FWD: 4,
};
