import { FPL_API_URL } from "@/lib/consts";
import { FPLPlayer, FPLTeam } from "@/lib/definitions";
import { Team } from "@/lib/definitions";
import { validateTeams, validatePlayers, transformPlayer } from "@/lib/utils";

interface FPLApiResponse {
  teams: FPLTeam[];
  elements: FPLPlayer[];
}
export async function GET() {
  try {
    const response = await fetch(FPL_API_URL);

    if (!response.ok) {
      const message = `FPL API request failed: ${response.status} ${response.statusText}`;
      console.error(message);
      return Response.json({ message }, { status: 502 });
    }

    const data: FPLApiResponse = await response.json();

    if (!data) {
      const message = "FPL data not found";
      console.error(message);
      return Response.json({ message }, { status: 503 });
    }

    console.log(
      `\nFetched ${data.teams.length} teams and ${data.elements.length} players`,
    );

    const teamValidation = validateTeams(data.teams);
    if (!teamValidation.valid) {
      console.error("\n❌ Team validation failed:");
      teamValidation.errors.forEach((error) => console.error(`  - ${error}`));

      return Response.json(
        { message: "Team validation failed", errors: teamValidation.errors },
        { status: 500 },
      );
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
      return Response.json(
        {
          message: "Player validation failed",
          errors: playerValidation.errors,
        },
        { status: 500 },
      );
    }
    console.log("✓ Player validation passed");

    return Response.json(players, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return Response.json({ message }, { status: 500 });
  }
}
