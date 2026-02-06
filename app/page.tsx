import { GameClient } from "@/components/game-client";
import { fetchPlayers } from "@/lib/data";
import { getTargetPlayer } from "@/lib/game";

export const dynamic = "force-dynamic";

export default async function Page() {
  const players = await fetchPlayers();
  const dateString = new Date().toISOString().split("T")[0];

  const targetPlayer = getTargetPlayer(players, dateString);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl space-y-6 md:space-y-8 mx-auto text-center">
        <div className="space-y-2 md:space-y-3">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">FPLdle</h1>
          <p className="text-base md:text-lg text-muted-foreground">
            Guess the daily Fantasy Premier League player!
          </p>
        </div>
        <GameClient
          players={players}
          dateString={dateString}
          targetPlayer={targetPlayer}
        />
      </div>
    </div>
  );
}
