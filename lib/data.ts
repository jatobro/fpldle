import { FPL_API_URL } from "./consts";
import { FPLPlayer, FPLTeam, Player, Team } from "./definitions";
import { validatePlayers, validateTeams, transformPlayer } from "./utils";

interface FPLApiResponse {
  teams: FPLTeam[];
  elements: FPLPlayer[];
}

export const fetchPlayers = async (): Promise<Player[]> => {
  try {
    const response = await fetch(FPL_API_URL);

    if (!response.ok) return [];

    const data: FPLApiResponse = await response.json();

    if (!data) return [];

    console.log(
      `\nFetched ${data.teams.length} teams and ${data.elements.length} players`,
    );

    const teamValidation = validateTeams(data.teams);
    if (!teamValidation.valid) {
      console.error("\n❌ Team validation failed:");
      teamValidation.errors.forEach((error) => console.error(`  - ${error}`));
      return [];
    }
    console.log("✓ Team validation passed");

    const teamMap = new Map<number, Team>(
      data.teams.map((team) => [team.id, team.name as Team]),
    );

    const players = data.elements
      .map((player) => transformPlayer(player, teamMap))
      .sort((a, b) => a.id - b.id);

    const playerValidation = validatePlayers(players);
    if (!playerValidation.valid) {
      console.error("\n❌ Player validation failed:");
      playerValidation.errors.forEach((error) => console.error(`  - ${error}`));
      return [];
    }
    console.log("✓ Player validation passed");

    return players;
  } catch (error) {
    console.error(error);
    return [];
  }
};
