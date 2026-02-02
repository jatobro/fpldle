import { FPL_API_URL } from "./consts";
import { POSITION_MAP } from "./consts";
import { FPLPlayer, FPLTeam, Team } from "./definitions";

interface FPLApiResponse {
  teams: FPLTeam[];
  elements: FPLPlayer[];
}

export const fetchPlayers = async () => {
  try {
    const response = await fetch(FPL_API_URL);

    if (!response.ok) return [];

    const data: FPLApiResponse = await response.json();

    if (!data) return [];

    const teamMap = new Map<number, Team>(
      data.teams.map((team) => [team.id, team.name as Team]),
    );

    const players = data.elements
      .map((player) => ({
        id: player.id,
        name: player.web_name,
        position: POSITION_MAP[player.element_type] || "MID",
        team: teamMap.get(player.team) || "Arsenal",
        price: player.now_cost / 10,
        form: parseFloat(player.form) || 0,
        points: player.total_points,
        selectedBy: parseFloat(player.selected_by_percent) || 0,
      }))
      .sort((a, b) => a.id - b.id);

    return players;
  } catch (error) {
    console.error(error);
    return [];
  }
};
