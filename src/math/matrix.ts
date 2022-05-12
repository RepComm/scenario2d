
// import { Vec2 } from "@repcomm/vec2d";

import { Vec2 } from "./vec.js";

let pi = Math.PI;
let RAD2DEG = 180 / pi;
let DEG2RAD = pi / 180;
let cos = Math.cos;
let sin = Math.sin;
let abs = Math.abs;
let sqrt = Math.sqrt;
let atan2 = Math.atan2;


export interface MatrixDecomposition {
  sx: number;
  sy: number;
  angle: number;
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export class Matrix {
  data: Array<number>;

  static tempTransformMatrix: Matrix;
  static tempRotationMatrix: Matrix;

  static Index: {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5
  };

  constructor () {

    if (!Matrix.Index) {
      Matrix.Index = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
        f: 5
      };
    }

    this.data = new Array(6);
    
    this.identity();
  }
  identity (): this {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.e = 0;
    this.f = 0;
    return this;
  }

  decompose (result: MatrixDecomposition) {
    Matrix.tempTransformMatrix.copy(this);

    let m = Matrix.tempTransformMatrix;
  
    result.sx = sqrt(m.a * m.a + m.b * m.b);
    result.sy = sqrt(m.c * m.c + m.d * m.d);
  
    if (m.a * m.d - m.c * m.b < 0) {
      if (m.a < m.d) {
        result.sx = -result.sx;
      } else {
        result.sy = -result.sy;
      }
    }
  
    m.scale(1 / result.sx, 1 / result.sy);
    result.angle = atan2(m.b, m.a) * RAD2DEG;
    m.rotate(-result.angle);
  
    result.a = m.a;
    result.b = m.b;
    result.c = m.c;
    result.d = m.d;
    result.e = m.e;
    result.f = m.f;
    return result;
  }

  compose (decomposed: MatrixDecomposition) {
    this
    .rotate(decomposed.angle)
    .scale(decomposed.sx, decomposed.sy);

    return this;
  }

  copy (from: Matrix): this {
    this.a = from.a;
    this.b = from.b;
    this.c = from.c;
    this.d = from.d;
    this.e = from.e;
    this.f = from.f;
    return this;
  }

  isIdentityOrTranslation (): boolean {
    return this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1;
  }

  get a (): number {
    return this.data[Matrix.Index.a];
  }
  set a (v: number) {
    this.data[Matrix.Index.a] = v;
  }

  get b (): number {
    return this.data[Matrix.Index.b];
  }
  set b (v: number) {
    this.data[Matrix.Index.b] = v;
  }

  get c (): number {
    return this.data[Matrix.Index.c];
  }
  set c (v: number) {
    this.data[Matrix.Index.c] = v;
  }

  get d (): number {
    return this.data[Matrix.Index.d];
  }
  set d (v: number) {
    this.data[Matrix.Index.d] = v;
  }

  get e (): number {
    return this.data[Matrix.Index.e];
  }
  set e (v: number) {
    this.data[Matrix.Index.e] = v;
  }

  get f (): number {
    return this.data[Matrix.Index.f];
  }
  set f (v: number) {
    this.data[Matrix.Index.f] = v;
  }

  det (): number {
    return this.a * this.d - this.b * this.c;
  }

  /**Calculates the inverse matrix and outputs to the 'destination' matrix, which is self by default
   * 
   * @param destination 
   * @returns 
   */
  inverse (destination: Matrix = this): this {
    
    let det = this.det(); //this.a * this.d - this.b * this.c;
    if (det) {
      if (this.isIdentityOrTranslation()) {
        destination.e = -this.e;
        destination.f = -this.f;
      } else {
        det = 1 / det;
        destination.a = this.d * det;
        destination.b = -this.b * det;
        destination.c = -this.c * det;
        destination.d = this.a * det;
        destination.e = (this.c * this.f - this.e * this.d) * det;
        destination.f = -(this.a * this.f - this.e * this.b) * det;
      }
    }
    return this;
  }

  multiply (other: Matrix): this {
    this.a = other.a * this.a + other.b * this.c;
    this.b = other.a * this.b + other.b * this.d;
    this.c = other.c * this.a + other.d * this.c;
    this.d = other.c * this.b + other.d * this.d;
    this.e = other.e * this.a + other.f * this.c + this.e;
    this.f = other.e * this.b + other.f * this.d + this.f;
    return this;
  }

  rotate (theta: number): this {
    theta *= DEG2RAD;
    let cosAngle = cos(theta);
    let sinAngle = sin(theta);
    
    Matrix.tempRotationMatrix.set(cosAngle, sinAngle, -sinAngle, cosAngle, 0, 0);

    this.multiply(Matrix.tempRotationMatrix);
   
    return this;
  }

  scale (sx: number, sy: number = undefined): this {
    if (sy === undefined) sy = sx;

    this.a *= sx;
    this.b *= sx;
    this.c *= sy;
    this.d *= sy;
    return this;
  }

  translate (tx: number, ty: number): this {
    this.e += tx * this.a + ty * this.c;
    this.f += tx * this.b + ty * this.d;
    return this;
  }

  // this = translation * this
  translateRight (tx, ty): this {
    this.e += tx || 0;
    this.f += ty || 0;
    return this;
  }

  equal (m: Matrix, p: number = 1E-6): boolean {
    if (this === m) return true;

    return (
      abs(this.a - m.a) <= p &&
      abs(this.b - m.b) <= p &&
      abs(this.c - m.c) <= p &&
      abs(this.d - m.d) <= p &&
      abs(this.e - m.e) <= p &&
      abs(this.f - m.f) <= p
    );
  }

  set (a: number, b: number, c: number, d: number, e: number, f: number): this {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;

    return this;
  }

  toString (): string {
    return `matrix(${this.data.join(",")})`;
  }

  transform (originX: number, originY: number, angle: number, sx: number, sy: number, x: number, y: number) {
    let inverted = Matrix.tempTransformMatrix;
    this.inverse(inverted);
  
    let tx = originX * inverted.a + originY * inverted.c + inverted.e;
    let ty = originX * inverted.b + originY * inverted.d + inverted.f;
  
    this.e = originX;
    this.f = originY;
  
    this.rotate(angle);

    this.scale(sx, sy);
    this.translate(-tx, -ty);
  
    this.e += x || 0;
    this.f += y || 0;
  
    return this;
  }

  transformPoint (point: Vec2): this {
    point.set(
      point.x * this.a + point.y * this.c + this.e,
      point.x * this.b + point.y * this.d + this.f
    );
    return this;
  }

  trs (t: Matrix, r: Matrix, s: Matrix) {
    this.multiply(t);
    this.multiply(r);
    this.multiply(s);
  }
}

Matrix.tempTransformMatrix = new Matrix();
Matrix.tempRotationMatrix = new Matrix();

// Matrix.Index = {
//   a: 0,
//   b: 1,
//   c: 2,
//   d: 3,
//   e: 4,
//   f: 6
// };
