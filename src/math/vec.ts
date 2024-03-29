
import { clamp, lerp } from "./general.js";

export interface Vec2Like {
  x: number;
  y: number;
}

export class Vec2 implements Vec2Like {
  x: number;
  y: number;
  constructor() {
    this.x = 0;
    this.y = 0;
  }
  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }
  getX(): number {
    return this.x;
  }
  getY(): number {
    return this.y;
  }
  setX(x: number): this {
    this.x = x;
    return this;
  }
  setY(y: number): this {
    this.y = y;
    return this;
  }
  /**Uses other vector's same named components, returns self*/
  add(other: Vec2Like): this {
    this.x += other.x;
    this.y += other.y;
    return this;
  }
  /**Uses other vector's same named components, returns self*/
  sub(other: Vec2Like): this {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }
  /**Uses other vector's same named components, returns self*/
  div(other: Vec2Like): this {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }
  /**Uses other vector's same named components, returns self*/
  mul(other: Vec2Like): this {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }
  copy(other: Vec2Like): this {
    this.set(other.x, other.y);
    return this;
  }
  divScalar(scalar: number): this {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }
  mulScalar(scalar: number): this {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }
  magnitude(): number {
    return Math.sqrt(
      Math.pow(this.x, 2) +
      Math.pow(this.y, 2)
    )
  }
  normalize(): Vec2 {
    this.divScalar(this.magnitude());
    return this;
  }
  distance(other: Vec2Like): number {
    return (
      Math.sqrt(
        Math.pow(this.x - other.x, 2) +
        Math.pow(this.y - other.y, 2)
      )
    );
  }
  lerp(other: Vec2Like, by: number): this {
    this.set(
      lerp(this.x, other.x, by),
      lerp(this.y, other.y, by)
    );
    return this;
  }
  centerOf(...vecs: Vec2Like[]): this {
    if (vecs.length < 1) return this; //don't divide by zero
    this.set(0, 0);
    for (let other of vecs) {
      this.add(other);
    }
    this.divScalar(vecs.length);
    return this;
  }
  clamp(xmin: number, xmax: number, ymin: number, ymax: number): this {
    this.set(clamp(this.x, xmin, xmax), clamp(this.y, ymin, ymax));
    return this;
  }
}