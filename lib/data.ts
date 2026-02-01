import { Player } from "./definitions";

export const fetchPlayers = async () => {
  const response = await fetch("api/players");
  const players: Player[] = await response.json();
  return players;
};
