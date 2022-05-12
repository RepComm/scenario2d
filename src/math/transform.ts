
import { Matrix, MatrixDecomposition } from "./matrix.js";
import { Vec2 } from "./vec.js";

export class Transform2d {
  position: Vec2;
  rotation: number;
  scale: number;

  matrix: Matrix;

  static tempDecomp: MatrixDecomposition;

  constructor () {
    this.position = new Vec2();
    this.rotation = 0;
    this.scale = 1;

    this.matrix = new Matrix();
  }
  renderMatrix (): this {
    this.matrix.set(1, 0, 0, 1, 0, 0);
    this.matrix.translate(this.position.x, this.position.y);
    this.matrix.rotate(this.rotation);
    this.matrix.scale(this.scale);
    return this;
  }
  copy (other: Transform2d): this {
    this.position.copy(other.position);
    this.rotation = other.rotation;
    this.scale = other.scale;
    this.matrix.copy(other.matrix);
    return this;
  }
  unrenderMatrix (): this {
    this.matrix.decompose(Transform2d.tempDecomp);

    this.rotation = Transform2d.tempDecomp.angle;
    this.scale = Transform2d.tempDecomp.sx;

    //TODO - make sure this is right
    this.position.set(
      Transform2d.tempDecomp.e,
      Transform2d.tempDecomp.f
    );

    return this;
  }
}

Transform2d.tempDecomp = {
  a: 0,
  angle: 0,
  b: 0,
  c: 0,
  d: 0,
  e: 0,
  f: 0,
  sx: 0,
  sy: 0
};
