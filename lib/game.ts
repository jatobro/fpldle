import type {
  Attribute,
  AttributeStatus,
  Player,
  Position,
  Team,
} from "./definitions";

// Comparison logic

function comparePosition(guess: Position, target: Position): AttributeStatus {
  if (guess === target) return { correctness: "correct", direction: null };
  return { correctness: "incorrect", direction: null };
}

function compareTeam(guess: Team, target: Team): AttributeStatus {
  if (guess === target) return { correctness: "correct", direction: null };
  return { correctness: "incorrect", direction: null };
}

function comparePrice(guess: number, target: number): AttributeStatus {
  if (guess === target) return { correctness: "correct", direction: null };
  const isClose = Math.abs(guess - target) <= 0.5;
  const correctness = isClose ? "close" : "incorrect";
  const direction = guess < target ? "up" : "down";
  return { correctness, direction };
}

function compareForm(guess: number, target: number): AttributeStatus {
  if (guess === target) return { correctness: "correct", direction: null };
  const isClose = Math.abs(guess - target) <= 1.0;
  const correctness = isClose ? "close" : "incorrect";
  const direction = guess < target ? "up" : "down";
  return { correctness, direction };
}

function comparePoints(guess: number, target: number): AttributeStatus {
  if (guess === target) return { correctness: "correct", direction: null };
  const isClose = Math.abs(guess - target) <= 10;
  const correctness = isClose ? "close" : "incorrect";
  const direction = guess < target ? "up" : "down";
  return { correctness, direction };
}

function compareSelectedBy(guess: number, target: number): AttributeStatus {
  if (guess === target) return { correctness: "correct", direction: null };
  const isClose = Math.abs(guess - target) <= 1;
  const correctness = isClose ? "close" : "incorrect";
  const direction = guess < target ? "up" : "down";
  return { correctness, direction };
}

// Main comparison function
export function comparePlayers(guess: Player, target: Player): Attribute[] {
  return [
    {
      key: "position",
      status: comparePosition(guess.position, target.position),
    },
    {
      key: "team",
      status: compareTeam(guess.team, target.team),
    },
    {
      key: "price",
      status: comparePrice(guess.price, target.price),
    },
    {
      key: "form",
      status: compareForm(guess.form, target.form),
    },
    {
      key: "points",
      status: comparePoints(guess.points, target.points),
    },
    {
      key: "selectedBy",
      status: compareSelectedBy(guess.selectedBy, target.selectedBy),
    },
  ];
}

// Daily player selection

function cyrb128(str: string) {
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
}

function sfc32(a: number, b: number, c: number, d: number) {
  return () => {
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
}

export function getTargetPlayer(players: Player[], dateString: string): Player {
  if (players.length === 0) throw new Error("No players found");

  let activePlayers = players.filter((p) => p.selectedBy > 0);

  if (activePlayers.length === 0) activePlayers = players;

  const seed = cyrb128(dateString);

  const a = seed;
  const b = 123456789;
  const c = 362436069;
  const d = 521288629;

  const random = sfc32(a, b, c, d);

  const index = Math.floor(random() * activePlayers.length);
  return activePlayers[index];
}
