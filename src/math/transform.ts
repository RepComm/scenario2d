
import { Vec2 } from "./vec";

export class Transform2d {
  position: Vec2;
  rotation: number;
  scale: number;
  constructor () {
    this.position = new Vec2();
    this.rotation = 0;
    this.scale = 1;
  }
}
