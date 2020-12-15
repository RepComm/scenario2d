
import { Transform2d } from "../math/transform";

export interface Object2DTraverseCallback {
  (child: Object2D):void;
}

export class Object2D {
  private parent: Object2D;
  private _transform: Transform2d;
  private children: Set<Object2D>;
  private preRenderStarted: boolean;
  private postRenderEnded: boolean;
  label: string;
  constructor () {
    this._transform = new Transform2d();
    this.postRenderEnded = true;
    this.label = "";
  }
  getTransform (): Transform2d {
    return this._transform;
  }
  get transform (): Transform2d {
    return this._transform;
  }
  getChildByLabel (label: string): Object2D {
    for (let child of this.children) {
      if (child.label == label) return child;
    }
    return undefined;
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
  getParent (): Object2D {
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
  preRender(ctx: CanvasRenderingContext2D) {
    if (this.preRenderStarted || !this.postRenderEnded) throw "Cannot pre render, previously pre-rendered without post render step";
    this.preRenderStarted = true;
    this.postRenderEnded = false;
    ctx.save();
    ctx.translate(
      this._transform.position.x,
      this._transform.position.y
    );
    ctx.rotate(
      this._transform.rotation
    );
    ctx.scale(
      this._transform.scale,
      this._transform.scale
    );
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
  traverse (traverseCallback: Object2DTraverseCallback): this {
    if (!this.children) return this;
    for (let child of this.children) {
      traverseCallback(child);
      child.traverse(traverseCallback);
    }
    return this;
  }
}
