import type { Player } from "./definitions";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

// Daily Player Selection

const cyrb128 = (str: string) => {
  let h1 = 1779033703;
  let h2 = 3144134277;
  let h3 = 1013904242;
  let h4 = 2773480762;

  for (let i = 0; i < str.length; i++) {
    const k = str.charCodeAt(i);
    h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
    h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
    h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
    h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
  }

  h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
  h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
  h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
  h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);

  return (h1 ^ h2 ^ h3 ^ h4) >>> 0;
};

const sfc32 = (a: number, b: number, c: number, d: number) => {
  return function () {
    a >>>= 0;
    b >>>= 0;
    c >>>= 0;
    d >>>= 0;
    let t = (a + b) | 0;
    a = b ^ (b >>> 9);
    b = (c + (c << 3)) | 0;
    c = (c << 21) | (c >>> 11);
    d = (d + 1) | 0;
    t = (t + d) | 0;
    c = (c + t) | 0;
    return (t >>> 0) / 4294967296;
  };
};

export const getDailyPlayer = (players: Player[], date: Date): Player => {
  const activePlayers = players.filter((p) => p.selectedBy > 0);

  const dateString = date.toISOString().split("T")[0];
  const seed = cyrb128(dateString);

  const a = seed;
  const b = 123456789;
  const c = 362436069;
  const d = 521288629;

  const random = sfc32(a, b, c, d);

  const maxId = Math.max(...activePlayers.map((p) => p.id));
  const randomId = Math.floor(random() * maxId);

  const exactPlayer = activePlayers.find((p) => p.id === randomId);

  if (exactPlayer) {
    return exactPlayer;
  }

  const fallbackPlayer = activePlayers.find((p) => p.id >= randomId);
  return fallbackPlayer || activePlayers[0];
};
