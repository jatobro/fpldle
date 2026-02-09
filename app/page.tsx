import { GameClient } from "@/components/game-client";
import { fetchPlayers } from "@/lib/data";
import { connection } from "next/server";

export default async function Page() {
  await connection();

  const players = await fetchPlayers();
  const dateString = new Date().toISOString().slice(0, 10);

  return (
    <div className="bg-background min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6 text-center md:space-y-8">
        <div className="space-y-2 md:space-y-3">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            FPLdle
          </h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Guess the daily Fantasy Premier League player!
          </p>
        </div>
        <GameClient players={players} dateString={dateString} />
      </div>
    </div>
  );
}
