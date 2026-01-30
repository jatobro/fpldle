import { TEAMS, Player, Position, Team } from "@/lib/definitions";
import fs from "fs";
import path from "path";

const FPL_API_URL = "https://fantasy.premierleague.com/api/bootstrap-static/";

interface FPLTeam {
  id: number;
  name: string;
  short_name: string;
}

interface FPLPlayer {
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

interface FPLApiResponse {
  teams: FPLTeam[];
  elements: FPLPlayer[];
}

const POSITION_MAP: Record<number, Position> = {
  1: "GK",
  2: "DEF",
  3: "MID",
  4: "FWD",
};

const fetchFPLData = async (): Promise<FPLApiResponse> => {
  console.log("Fetching data from FPL API...");

  const response = await fetch(FPL_API_URL);

  if (!response.ok)
    throw new Error(
      `FPL API request failed: ${response.status} ${response.statusText}`,
    );

  return response.json();
};

const validateTeams = (
  teams: FPLTeam[],
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const apiTeamNames = new Set(teams.map((t) => t.name));

  TEAMS.forEach((validTeam) => {
    if (!apiTeamNames.has(validTeam)) {
      errors.push(`Missing team: ${validTeam}`);
    }
  });

  apiTeamNames.forEach((apiTeam) => {
    if (!TEAMS.includes(apiTeam as Team)) {
      errors.push(`Unexpected team in API: ${apiTeam}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

const transformPlayer = (
  player: FPLPlayer,
  teamMap: Map<number, Team>,
): Player => {
  return {
    id: player.id,
    name: player.web_name,
    position: POSITION_MAP[player.element_type] || "MID",
    team: teamMap.get(player.team) || "Arsenal",
    price: player.now_cost / 10,
    nationality: player.nation,
    form: parseFloat(player.form) || 0,
    points: player.total_points,
    selectedBy: parseFloat(player.selected_by_percent) || 0,
  };
};

const validatePlayers = (players: Player[]) => {
  const errors: string[] = [];

  if (players.length < 100) {
    errors.push(`Too few players: ${players.length} (expected more than 100)`);
  }

  players.forEach((player) => {
    if (player.name.length === 0) {
      errors.push(`Player ${player.id} has empty name`);
    }

    if (!TEAMS.includes(player.team)) {
      errors.push(`Player ${player.name} has invalid team: ${player.team}`);
    }
    if (!["GK", "DEF", "MID", "FWD"].includes(player.position)) {
      errors.push(
        `Player ${player.name} has invalid position: ${player.position}`,
      );
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

const savePlayersData = (players: Player[]) => {
  const outputPath = path.join(process.cwd(), "lib", "players.json");

  fs.writeFileSync(outputPath, JSON.stringify(players, null, 2));
  console.log(`✓ Saved ${players.length} players to ${outputPath}`);
};

const main = async () => {
  try {
    const data = await fetchFPLData();

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

    const outputPath = path.join(process.cwd(), "lib", "players.json");

    const exists = fs.existsSync(outputPath);
    if (exists) {
      console.log(`\nExisting data file found at ${outputPath}`);
      console.log("✓ Validation passed - overwriting existing data");
    }

    savePlayersData(players);
    console.log("\n✅ Data fetch and save completed successfully!");
  } catch (error) {
    console.error("\n❌ Error fetching FPL data:", error);
    process.exit(1);
  }
};

main();
