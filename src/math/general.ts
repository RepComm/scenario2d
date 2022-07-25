
export const EPSILON = 0.00001;

export const radians = (deg: number): number=>deg*Math.PI/180;

export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(
    Math.min(
      value, max
    ),
    min
  );
}

export const randomByte = (): number => Math.floor(Math.random()*255);

export function lerp (from: number, to: number, by: number): number {
  return from*(1-by)+to*by;
}

export let RAD2DEG = 180 / Math.PI;
export let DEG2RAD = Math.PI / 180;
