export const EPSILON = 0.00001;
export const radians = deg => deg * Math.PI / 180;
export const clamp = (value, min, max) => {
  return Math.max(Math.min(value, max), min);
};
export const randomByte = () => Math.floor(Math.random() * 255);
export function lerp(from, to, by) {
  return from * (1 - by) + to * by;
}
export let RAD2DEG = 180 / Math.PI;
export let DEG2RAD = Math.PI / 180;