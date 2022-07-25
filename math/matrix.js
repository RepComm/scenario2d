import { DEG2RAD } from "./general.js";
export class Matrix {
  constructor() {
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

  identity() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.e = 0;
    this.f = 0;
    return this;
  }

  decompose(decomp) {
    decomp.x = this.e;
    decomp.y = this.f;
    decomp.r = 0;
    decomp.sx = 1;
    decomp.sy = 1;
    decomp.skx = 0;
    decomp.sky = 0;
    let determ = this.det(); // Apply the QR-like decomposition.

    if (this.a || this.b) {
      let r = Math.sqrt(this.a * this.a + this.b * this.b);
      decomp.r = this.b > 0 ? Math.acos(this.a / r) : -Math.acos(this.a / r);
      decomp.sx = r;
      decomp.sy = determ / r;
      decomp.skx = Math.atan((this.a * this.c + this.b * this.d) / (r * r));
    } else if (this.c || this.d) {
      let s = Math.sqrt(this.c * this.c + this.d * this.d);
      decomp.r = Math.PI * 0.5 - (this.d > 0 ? Math.acos(-this.c / s) : -Math.acos(this.c / s));
      decomp.sx = determ / s;
      decomp.sy = s;
      decomp.sky = Math.atan((this.a * this.c + this.b * this.d) / (s * s));
    } else {
      // a = b = c = d = 0
      decomp.sx = 0;
      decomp.sy = 0; // = invalid matrix
    }
  }

  copy(from) {
    this.a = from.a;
    this.b = from.b;
    this.c = from.c;
    this.d = from.d;
    this.e = from.e;
    this.f = from.f;
    return this;
  }

  isIdentityOrTranslation() {
    return this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1;
  }

  get a() {
    return this.data[Matrix.Index.a];
  }

  set a(v) {
    this.data[Matrix.Index.a] = v;
  }

  get b() {
    return this.data[Matrix.Index.b];
  }

  set b(v) {
    this.data[Matrix.Index.b] = v;
  }

  get c() {
    return this.data[Matrix.Index.c];
  }

  set c(v) {
    this.data[Matrix.Index.c] = v;
  }

  get d() {
    return this.data[Matrix.Index.d];
  }

  set d(v) {
    this.data[Matrix.Index.d] = v;
  }

  get e() {
    return this.data[Matrix.Index.e];
  }

  set e(v) {
    this.data[Matrix.Index.e] = v;
  }

  get f() {
    return this.data[Matrix.Index.f];
  }

  set f(v) {
    this.data[Matrix.Index.f] = v;
  }

  det() {
    return this.a * this.d - this.b * this.c;
  }
  /**Calculates the inverse matrix and outputs to the 'destination' matrix, which is self by default
   * 
   * @param destination 
   * @returns 
   */


  inverse(destination = this) {
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

  rotate(theta) {
    theta *= DEG2RAD;
    let cos = Math.cos(theta),
        sin = Math.sin(theta);
    this.transform(cos, sin, -sin, cos, 0, 0);
    return this;
  }

  scale(sx) {
    this.transform(sx, 0, 0, sx, 0, 0);
    return this;
  }

  multiply(b) {
    this.transform(b.a, b.b, b.c, b.d, b.e, b.f);
    return this;
  }

  transform(a2, b2, c2, d2, e2, f2) {
    let a1 = this.a,
        b1 = this.b,
        c1 = this.c,
        d1 = this.d,
        e1 = this.e,
        f1 = this.f;
    /* matrix order (canvas compatible):
    * ace
    * bdf
    * 001
    */

    this.a = a1 * a2 + c1 * b2;
    this.b = b1 * a2 + d1 * b2;
    this.c = a1 * c2 + c1 * d2;
    this.d = b1 * c2 + d1 * d2;
    this.e = a1 * e2 + c1 * f2 + e1;
    this.f = b1 * e2 + d1 * f2 + f1;
  }

  translate(tx, ty) {
    return this.transform(1, 0, 0, 1, tx, ty);
  } // this = translation * this


  translateRight(tx, ty) {
    this.e += tx || 0;
    this.f += ty || 0;
    return this;
  }

  equal(m, p = 1E-6) {
    if (this === m) return true;
    return Math.abs(this.a - m.a) <= p && Math.abs(this.b - m.b) <= p && Math.abs(this.c - m.c) <= p && Math.abs(this.d - m.d) <= p && Math.abs(this.e - m.e) <= p && Math.abs(this.f - m.f) <= p;
  }

  set(a, b, c, d, e, f) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.e = e;
    this.f = f;
    return this;
  }

  toString() {
    return `matrix(${this.data.join(",")})`;
  }

  transformPoint(point) {
    point.set(point.x * this.a + point.y * this.c + this.e, point.x * this.b + point.y * this.d + this.f);
    return this;
  }

  trs(t, r, s) {
    this.multiply(t);
    this.multiply(r);
    this.multiply(s);
  }

}
Matrix.tempTransformMatrix = new Matrix();
Matrix.tempRotationMatrix = new Matrix(); // Matrix.Index = {
//   a: 0,
//   b: 1,
//   c: 2,
//   d: 3,
//   e: 4,
//   f: 6
// };