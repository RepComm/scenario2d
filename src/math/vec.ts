
import { lerp } from "./general.js";

export class Vec2 {
  x: number;
  y: number;
  constructor () {
    this.x = 0;
    this.y = 0;
  }
  set(x: number, y: number): Vec2 {
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
  setX(x: number): Vec2 {
    this.x = x;
    return this;
  }
  setY(y: number): Vec2 {
    this.y = y;
    return this;
  }
  /**Uses other vector's same named components, returns self*/
  add(other: Vec2): Vec2 {
    this.x += other.x;
    this.y += other.y;
    return this;
  }
  /**Uses other vector's same named components, returns self*/
  sub(other: Vec2): Vec2 {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }
  /**Uses other vector's same named components, returns self*/
  div(other: Vec2): Vec2 {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }
  /**Uses other vector's same named components, returns self*/
  mul(other: Vec2): Vec2 {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }
  copy(other: Vec2): Vec2 {
    this.set(other.x, other.y);
    return this;
  }
  divScalar(scalar: number): Vec2 {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }
  mulScalar(scalar: number): Vec2 {
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
  distance(other: Vec2): number {
    return (
      Math.sqrt(
        Math.pow( this.x - other.x , 2 ) +
        Math.pow( this.y - other.y , 2 )
      )
    );
  }
  lerp (other: Vec2, by: number): Vec2 {
    this.set(
      lerp(this.x, other.x, by),
      lerp(this.y, other.y, by)
    );
    return this;
  }
  centerOf (...vecs: Vec2[]): Vec2 {
    this.set(0,0);
    for (let other of vecs) {
      this.add(other);
    }
    this.divScalar(vecs.length);
    return this;
  }
}
