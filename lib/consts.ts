import { Position } from "./definitions";

export const API_BASE_URL = "https://fpldle-omega.vercel.app/api";

export const FPL_API_URL =
  "https://fantasy.premierleague.com/api/bootstrap-static/";

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

export const POSITION_MAP: Record<number, Position> = {
  1: "GK",
  2: "DEF",
  3: "MID",
  4: "FWD",
};
