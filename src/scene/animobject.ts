
import { PathObject2D } from "./pathobject.js";

export class AnimObject2D extends PathObject2D {
  constructor () {
    super();
  }

  render (ctx: CanvasRenderingContext2D): this {
    //TODO - implement sprite sheet anim
    super.render(ctx);
    return this;
  }
}
