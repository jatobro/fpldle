import { POSITION_ORDER, POSITION_MAP } from "./consts";
import { Team, Position, Player, FPLApiResponse } from "./definitions";
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

export const isPositionAdjacent = (guess: Position, target: Position) =>
  Math.abs(POSITION_ORDER[guess] - POSITION_ORDER[target]) === 1;

export const getTodayDateString = () => new Date().toISOString().split("T")[0];
