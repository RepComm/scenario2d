import { clamp, lerp } from "./general.js";
export class Vec2 {
  constructor() {
    this.x = 0;
    this.y = 0;
  }

  set(x, y) {
    this.x = x;
    this.y = y;
    return this;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  setX(x) {
    this.x = x;
    return this;
  }

  setY(y) {
    this.y = y;
    return this;
  }
  /**Uses other vector's same named components, returns self*/


  add(other) {
    this.x += other.x;
    this.y += other.y;
    return this;
  }
  /**Uses other vector's same named components, returns self*/


  sub(other) {
    this.x -= other.x;
    this.y -= other.y;
    return this;
  }
  /**Uses other vector's same named components, returns self*/


  div(other) {
    this.x /= other.x;
    this.y /= other.y;
    return this;
  }
  /**Uses other vector's same named components, returns self*/


  mul(other) {
    this.x *= other.x;
    this.y *= other.y;
    return this;
  }

  copy(other) {
    this.set(other.x, other.y);
    return this;
  }

  divScalar(scalar) {
    this.x /= scalar;
    this.y /= scalar;
    return this;
  }

  mulScalar(scalar) {
    this.x *= scalar;
    this.y *= scalar;
    return this;
  }

  magnitude() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }

  normalize() {
    this.divScalar(this.magnitude());
    return this;
  }

  distance(other) {
    return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
  }

  lerp(other, by) {
    this.set(lerp(this.x, other.x, by), lerp(this.y, other.y, by));
    return this;
  }

  centerOf(...vecs) {
    if (vecs.length < 1) return this; //don't divide by zero

    this.set(0, 0);

    for (let other of vecs) {
      this.add(other);
    }

    this.divScalar(vecs.length);
    return this;
  }

  clamp(xmin, xmax, ymin, ymax) {
    this.set(clamp(this.x, xmin, xmax), clamp(this.y, ymin, ymax));
    return this;
  }

}