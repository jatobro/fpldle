import { FPL_API_URL } from "@/lib/consts";
import { FPLPlayer, FPLTeam } from "@/lib/definitions";
import { Team } from "@/lib/definitions";
import { validateTeams, validatePlayers, transformPlayer } from "@/lib/utils";

interface FPLApiResponse {
  teams: FPLTeam[];
  elements: FPLPlayer[];
}
export async function GET() {
  const response = await fetch(FPL_API_URL);

  if (!response.ok) {
    console.error(
      `FPL API request failed: ${response.status} ${response.statusText}`,
    );
    return Response.json(response.statusText);
  }

  const data: FPLApiResponse = await response.json();

  if (!data) {
    console.error("FPL API data not found");
    return Response.json("FPL API data not found");
  }

  console.log(
    `\nFetched ${data.teams.length} teams and ${data.elements.length} players`,
  );

  const teamValidation = validateTeams(data.teams);
  if (!teamValidation.valid) {
    console.error("\n❌ Team validation failed:");
    teamValidation.errors.forEach((error) => console.error(`  - ${error}`));

    return Response.json(teamValidation.errors);
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
    return Response.json(playerValidation.errors);
  }
  console.log("✓ Player validation passed");

  return Response.json(players);
}
