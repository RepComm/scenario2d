
import { Transform2d } from "../math/transform.js";

export interface Object2DTraverseCallback {
  (child: Object2D): void;
}

export class Object2D {
  private parent: Object2D;

  private _localTransform: Transform2d;
  private _globalTransform: Transform2d;

  private children: Set<Object2D>;
  private preRenderStarted: boolean;
  private postRenderEnded: boolean;
  label: string;
  constructor() {
    this._localTransform = new Transform2d();
    this._globalTransform = new Transform2d();

    this.postRenderEnded = true;
    this.label = "";
  }
  getTransform(): Transform2d {
    return this._localTransform;
  }
  get transform(): Transform2d {
    return this._localTransform;
  }
  getGlobalTransform (): Transform2d {
    return this._globalTransform;
  }
  get globalTransform (): Transform2d {
    return this._globalTransform;
  }
  getChildByLabel(label: string, recursive: boolean = true): Object2D {
    let result: Object2D;

    if (recursive) {
      this.traverse((child)=>{
        if (child.label == label) {
          result = child;
          return;
        }
      });
    } else {
      for (let child of this.children) {
        if (child.label == label) {
          result = child;
          break;
        }
      }
    }
    return result;
  }
  hasChildren(): boolean {
    return this.children && this.children.size > 0;
  }
  has(child: Object2D): boolean {
    return (this.children && this.children.has(child));
  }
  remove(child: Object2D, alertChild: boolean = true): this {
    if (!this.children || !this.children.has(child)) throw "Cannot remove child as it was not contained in children set";
    if (alertChild && child.hasParent()) {
      child.removeSelf(false);
    }
    this.children.delete(child);
    return this;
  }
  hasParent(): boolean {
    return this.parent != null && this.parent != undefined;
  }
  removeSelf(alertParent: boolean = true): Object2D {
    if (!this.hasParent()) throw "Cannot remove self, parent is not defined";
    if (alertParent) {
      this.parent.remove(this, false);
    }
    this.parent = undefined;
    return this;
  }
  setParent(parent: Object2D, alertParent: boolean = true): this {
    if (!parent) throw "Parent is not defined";
    if (alertParent) {
      parent.add(this, false);
    }
    this.parent = parent;
    return this;
  }
  getParent(): Object2D {
    return this.parent;
  }
  add(child: Object2D, alertChild: boolean = true): this {
    if (!this.children) this.children = new Set();
    if (this.has(child)) {
      console.log("Child was added twice", child);
      // throw `Cannot add child twice`;
    }
    if (child.hasParent()) child.removeSelf(true);

    this.children.add(child);
    if (alertChild) {
      child.setParent(this, false);
    }
    return this;
  }
  renderGlobalTransform () {
    this._globalTransform.copy(this._localTransform);
    
    if (this.hasParent()) {
      this._globalTransform.matrix.multiply(this.parent._globalTransform.matrix);
    }
    this._globalTransform.unrenderMatrix();
  }
  preRender(ctx: CanvasRenderingContext2D) {
    if (this.preRenderStarted || !this.postRenderEnded) throw "Cannot pre render, previously pre-rendered without post render step";
    this.preRenderStarted = true;
    this.postRenderEnded = false;
    ctx.save();

    this._localTransform.renderMatrix();
    
    this.renderGlobalTransform();

    ctx.setTransform(
      this._globalTransform.matrix.a,
      this._globalTransform.matrix.b,
      this._globalTransform.matrix.c,
      this._globalTransform.matrix.d,
      this._globalTransform.matrix.e,
      this._globalTransform.matrix.f
    );

    // ctx.setTransform(
    //   this._localTransform.matrix.a,
    //   this._localTransform.matrix.b,
    //   this._localTransform.matrix.c,
    //   this._localTransform.matrix.d,
    //   this._localTransform.matrix.e,
    //   this._localTransform.matrix.f
    // );

    // ctx.translate(
    //   this.localTransform.position.x,
    //   this.localTransform.position.y
    // );
    // ctx.rotate(
    //   this.localTransform.rotation
    // );
    // ctx.scale(
    //   this.localTransform.scale,
    //   this.localTransform.scale
    // );
  }
  postRender(ctx: CanvasRenderingContext2D) {
    if (!this.preRenderStarted || this.postRenderEnded) throw "Cannot post render, previously didn't pre render";
    this.preRenderStarted = false;
    ctx.restore();
    this.postRenderEnded = true;
  }
  renderChildren(ctx: CanvasRenderingContext2D) {
    if (this.children) {
      for (let child of this.children) {
        child.render(ctx);
      }
    }
  }
  render(ctx: CanvasRenderingContext2D): this {
    this.preRender(ctx);
    this.renderChildren(ctx);

    this.postRender(ctx);
    return this;
  }
  traverse(traverseCallback: Object2DTraverseCallback): this {
    if (!this.children) return this;
    for (let child of this.children) {
      traverseCallback(child);
      child.traverse(traverseCallback);
    }
    return this;
  }
}
