import { FPL_API_URL } from "./consts";
import { FPLApiResponse } from "./definitions";
import { transformFPLData } from "./utils";

export const fetchPlayers = async () => {
  const response = await fetch(FPL_API_URL);

  if (!response.ok)
    throw new Error(
      `Failed to fetch data from FPL API: ${response.statusText}`,
    );

  const data: FPLApiResponse = await response.json();

  if (!data) throw new Error("FPL API data not found");

  return transformFPLData(data);
};
