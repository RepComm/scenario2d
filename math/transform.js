import { Matrix } from "./matrix.js";
import { Vec2 } from "./vec.js";
export class Transform2d {
  constructor() {
    this.position = new Vec2();
    this.rotation = 0;
    this.scale = 1;
    this.matrix = new Matrix();
  }

  renderMatrix() {
    this.matrix.set(1, 0, 0, 1, 0, 0);
    this.matrix.translate(this.position.x, this.position.y);
    this.matrix.rotate(this.rotation);
    this.matrix.scale(this.scale);
    return this;
  }

  copy(other) {
    this.position.copy(other.position);
    this.rotation = other.rotation;
    this.scale = other.scale;
    this.matrix.copy(other.matrix);
    return this;
  }

  unrenderMatrix() {
    this.matrix.decompose(Transform2d.tempDecomp);
    this.rotation = Transform2d.tempDecomp.r;
    this.scale = Transform2d.tempDecomp.sx; //TODO - make sure this is right

    this.position.set(Transform2d.tempDecomp.x, Transform2d.tempDecomp.y);
    return this;
  }

}
Transform2d.tempDecomp = {
  r: 0,
  skx: 0,
  sky: 0,
  sx: 1,
  sy: 1,
  x: 0,
  y: 0
};