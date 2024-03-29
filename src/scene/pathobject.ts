
import { Object2D } from "./object.js";
import { GradientDef } from "./gradients.js";

export class PathObject2D extends Object2D {
  path: Path2D;
  private _d: string;
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  doStroke: boolean;
  doFill: boolean;
  fillGradientDef: GradientDef;
  
  strokeGradientDef: GradientDef;
  
  constructor() {
    super();
    this.fillStyle = "white";
    this.strokeStyle = "white";
    this.lineWidth = 1;
    this.doStroke = true;
    this.doFill = true;
    this._d = "";
  }
  enableStroke(enable: boolean = true): PathObject2D {
    this.doStroke = enable;
    return this;
  }
  enableFill(enable: boolean = true): PathObject2D {
    this.doFill = enable;
    return this;
  }
  private setPath(path: Path2D): PathObject2D {
    this.path = path;
    return this;
  }
  set d (str: string) {
    this.path = new Path2D(str);
    this._d = str;
  }
  get d (): string {
    return this._d;
  }
  private getPath(): Path2D {
    return this.path;
  }
  hasPath(): boolean {
    return this.path != null && this.path != undefined;
  }
  setGradientFill(gradDef: GradientDef): Object2D {
    this.fillGradientDef = gradDef;
    return this;
  }
  setGradientStroke(gradDef: GradientDef): Object2D {
    this.strokeGradientDef = gradDef;
    return this;
  }
  render(ctx: CanvasRenderingContext2D): this {
    this.preRender(ctx);

    if (this.path) {
      ctx.lineWidth = this.lineWidth / this.globalTransform.scale;

      if (this.doFill) {
        if (this.fillGradientDef && this.fillGradientDef.needsCompile) {
          this.fillGradientDef.compile(ctx);
          this.fillStyle = this.fillGradientDef.compiled;
        }
        ctx.fillStyle = this.fillStyle;
        ctx.fill(this.path);
      }
      if (this.doStroke) {
        if (this.strokeGradientDef && this.strokeGradientDef.needsCompile) {
          this.strokeGradientDef.compile(ctx);
          this.strokeStyle = this.strokeGradientDef.compiled;
        }
        ctx.strokeStyle = this.strokeStyle;
        ctx.stroke(this.path);
      }
    } else {
      console.warn("No path to render");
    }

    this.renderChildren(ctx);

    this.postRender(ctx);
    return this;
  }
}
