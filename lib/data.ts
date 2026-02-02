import { Player } from "./definitions";

export const fetchPlayers = async (): Promise<Player[]> => {
  const response = await fetch(`${process.env.API_BASE_URL}/players`, {
    next: {
      revalidate: 86400,
    },
  });
  const players = await response.json();
  return players;
};
