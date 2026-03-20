import { randomInt } from "crypto";

export function randomNumber(min: number, max: number) {
  return randomInt(min, max);
}

export function gaussianRandom(mean: number, std: number): number {
  const u = 1 - Math.random();
  const v = Math.random();
  const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return Math.round(z * std + mean);
}
