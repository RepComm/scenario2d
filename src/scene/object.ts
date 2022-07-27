
import { Transform2d } from "../math/transform.js";

export interface Object2DTraverseCallback {
  (child: Object2D): void;
}

export class Object2D {
  parent: Object2D;

  localTransform: Transform2d;
  globalTransform: Transform2d;

  children: Set<Object2D>;
  preRenderStarted: boolean;
  postRenderEnded: boolean;
  label: string;
  constructor() {
    this.localTransform = new Transform2d();
    this.globalTransform = new Transform2d();

    this.postRenderEnded = true;
    this.label = "";
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
    if (this.hasParent()) {
      this.globalTransform.matrix.copy(this.parent.globalTransform.matrix);
      this.globalTransform.matrix.multiply(this.localTransform.matrix);
    } else {
      this.globalTransform.matrix.copy(this.localTransform.matrix);
    }
    this.globalTransform.unrenderMatrix();
  }
  preRender(ctx: CanvasRenderingContext2D) {
    if (this.preRenderStarted || !this.postRenderEnded) throw "Cannot pre render, previously pre-rendered without post render step";
    this.preRenderStarted = true;
    this.postRenderEnded = false;
    ctx.save();

    this.localTransform.renderMatrix();
    
    this.renderGlobalTransform();

    //preserve arbitrary scene transformations not performed by this lib on the canvas (such as camera movement)
    ctx.transform(
      this.localTransform.matrix.a,
      this.localTransform.matrix.b,
      this.localTransform.matrix.c,
      this.localTransform.matrix.d,
      this.localTransform.matrix.e,
      this.localTransform.matrix.f
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
  onRenderSelf (ctx: CanvasRenderingContext2D) : this {
    
    return this;
  }
  /**Called internally, use/override onRenderSelf! */
  render(ctx: CanvasRenderingContext2D): this {
    this.preRender(ctx);
    this.renderChildren(ctx);
    this.onRenderSelf(ctx);
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
