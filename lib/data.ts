import { API_BASE_URL } from "./consts";
import { Player } from "./definitions";

export const fetchPlayers = async () => {
  const response = await fetch(`${API_BASE_URL}/players`);
  const players: Player[] = await response.json();
  return players;
};
