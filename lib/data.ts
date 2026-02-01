import { FPL_API_URL } from "./consts";
import { FPLTeam, FPLPlayer, Team } from "./definitions";
import { validateTeams, validatePlayers, transformPlayer } from "./utils";

interface FPLApiResponse {
  teams: FPLTeam[];
  elements: FPLPlayer[];
}

export const fetchPlayers = async () => {
  const response = await fetch(FPL_API_URL);

  if (!response.ok)
    throw new Error(
      `FPL API request failed: ${response.status} ${response.statusText}`,
    );

  const data: FPLApiResponse = await response.json();

  console.log(
    `\nFetched ${data.teams.length} teams and ${data.elements.length} players`,
  );

  const teamValidation = validateTeams(data.teams);
  if (!teamValidation.valid) {
    console.error("\n❌ Team validation failed:");
    teamValidation.errors.forEach((error) => console.error(`  - ${error}`));
    process.exit(1);
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
    process.exit(1);
  }
  console.log("✓ Player validation passed");

  return players;
};
