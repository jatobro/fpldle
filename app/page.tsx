import { GameClient } from "@/components/game-client";
import { fetchPlayers } from "@/lib/data";
import { getTargetPlayer } from "@/lib/game";

export default async function Page() {
  const players = await fetchPlayers();
  const targetPlayer = getTargetPlayer(players);
  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl space-y-4 mx-auto text-center">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold">FPLdle</h1>
          <p className="text-muted-foreground">
            Guess the daily Fantasy Premier League player!
          </p>
        </div>
        <GameClient players={players} targetPlayer={targetPlayer} />
      </div>
    </div>
  );
}
