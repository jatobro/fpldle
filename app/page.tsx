import { fetchPlayers } from "@/lib/data";
import { getDailyPlayer } from "@/lib/game";

export default async function Page() {
  const players = await fetchPlayers();
  const dailyPlayer = getDailyPlayer(players);
  return (
    <div>
      <h1 className="text-2xl">{dailyPlayer.name}</h1>
      <div>
        {players.map((player) => (
          <div key={player.id}>{player.name}</div>
        ))}
      </div>
    </div>
  );
}
