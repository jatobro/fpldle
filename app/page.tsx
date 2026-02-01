import { fetchPlayers } from "@/lib/data";

export default async function Page() {
  const players = await fetchPlayers();
  return (
    <div>
      {players.map((player) => (
        <div key={player.id}>{player.name}</div>
      ))}
    </div>
  );
}
