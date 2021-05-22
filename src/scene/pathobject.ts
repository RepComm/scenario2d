
import { Object2D } from "./object";
import { GradientDef } from "./scene2d";

export class PathObject2D extends Object2D {
  path: Path2D;
  private _d: string;
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  doStroke: boolean;
  doFill: boolean;
  fillGradientDef: GradientDef;
  needsFillGradientCompile: boolean;
  strokeGradientDef: GradientDef;
  needsStrokeGradientCompile: boolean;
  constructor() {
    super();
    this.fillStyle = "white";
    this.strokeStyle = "white";
    this.lineWidth = 1;
    this.doStroke = true;
    this.doFill = true;
    this.needsFillGradientCompile = false;
    this.needsStrokeGradientCompile = false;
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
    if (this.fillGradientDef) {
      this.needsFillGradientCompile = true;
    } else {
      this.needsFillGradientCompile = false;
    }
    return this;
  }
  setGradientStroke(gradDef: GradientDef): Object2D {
    this.strokeGradientDef = gradDef;
    if (this.strokeGradientDef) {
      this.needsStrokeGradientCompile = true;
    } else {
      this.needsStrokeGradientCompile = false;
    }
    return this;
  }
  render(ctx: CanvasRenderingContext2D): this {
    this.preRender(ctx);

    if (this.path) {
      ctx.lineWidth = this.lineWidth / this.getTransform().scale;

      if (this.doFill) {
        if (this.needsFillGradientCompile) {
          this.needsFillGradientCompile = false;
          this.fillGradientDef.compile(ctx);
          this.fillStyle = this.fillGradientDef.compiled;
        }
        ctx.fillStyle = this.fillStyle;
        ctx.fill(this.path);
      }
      if (this.doStroke) {
        if (this.needsStrokeGradientCompile) {
          this.needsStrokeGradientCompile = false;
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

