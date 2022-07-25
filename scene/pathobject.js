import { Object2D } from "./object.js";
export class PathObject2D extends Object2D {
  constructor() {
    super();
    this.fillStyle = "white";
    this.strokeStyle = "white";
    this.lineWidth = 1;
    this.doStroke = true;
    this.doFill = true;
    this._d = "";
  }

  enableStroke(enable = true) {
    this.doStroke = enable;
    return this;
  }

  enableFill(enable = true) {
    this.doFill = enable;
    return this;
  }

  setPath(path) {
    this.path = path;
    return this;
  }

  set d(str) {
    this.path = new Path2D(str);
    this._d = str;
  }

  get d() {
    return this._d;
  }

  getPath() {
    return this.path;
  }

  hasPath() {
    return this.path != null && this.path != undefined;
  }

  setGradientFill(gradDef) {
    this.fillGradientDef = gradDef;
    return this;
  }

  setGradientStroke(gradDef) {
    this.strokeGradientDef = gradDef;
    return this;
  }

  render(ctx) {
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