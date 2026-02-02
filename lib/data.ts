import { FPL_API_URL } from "./consts";
import { FPLApiResponse } from "./definitions";
import { transformFPLData } from "./utils";

export const fetchPlayers = async () => {
  try {
    const response = await fetch(FPL_API_URL);

    if (!response.ok) return [];

    const data: FPLApiResponse = await response.json();

    if (!data) return [];

    return transformFPLData(data);
  } catch (error) {
    console.error(error);
    return [];
  }
};
