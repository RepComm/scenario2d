import { Transform2d } from "../math/transform.js";
export class Object2D {
  constructor() {
    this.localTransform = new Transform2d();
    this.globalTransform = new Transform2d();
    this.postRenderEnded = true;
    this.label = "";
  }

  getChildByLabel(label, recursive = true) {
    let result;

    if (recursive) {
      this.traverse(child => {
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

  hasChildren() {
    return this.children && this.children.size > 0;
  }

  has(child) {
    return this.children && this.children.has(child);
  }

  remove(child, alertChild = true) {
    if (!this.children || !this.children.has(child)) throw "Cannot remove child as it was not contained in children set";

    if (alertChild && child.hasParent()) {
      child.removeSelf(false);
    }

    this.children.delete(child);
    return this;
  }

  hasParent() {
    return this.parent != null && this.parent != undefined;
  }

  removeSelf(alertParent = true) {
    if (!this.hasParent()) throw "Cannot remove self, parent is not defined";

    if (alertParent) {
      this.parent.remove(this, false);
    }

    this.parent = undefined;
    return this;
  }

  setParent(parent, alertParent = true) {
    if (!parent) throw "Parent is not defined";

    if (alertParent) {
      parent.add(this, false);
    }

    this.parent = parent;
    return this;
  }

  add(child, alertChild = true) {
    if (!this.children) this.children = new Set();

    if (this.has(child)) {
      console.log("Child was added twice", child); // throw `Cannot add child twice`;
    }

    if (child.hasParent()) child.removeSelf(true);
    this.children.add(child);

    if (alertChild) {
      child.setParent(this, false);
    }

    return this;
  }

  renderGlobalTransform() {
    if (this.hasParent()) {
      this.globalTransform.matrix.copy(this.parent.globalTransform.matrix);
      this.globalTransform.matrix.multiply(this.localTransform.matrix);
    } else {
      this.globalTransform.matrix.copy(this.localTransform.matrix);
    }

    this.globalTransform.unrenderMatrix();
  }

  preRender(ctx) {
    if (this.preRenderStarted || !this.postRenderEnded) throw "Cannot pre render, previously pre-rendered without post render step";
    this.preRenderStarted = true;
    this.postRenderEnded = false;
    ctx.save();
    this.localTransform.renderMatrix();
    this.renderGlobalTransform(); //preserve arbitrary scene transformations not performed by this lib on the canvas (such as camera movement)

    ctx.transform(this.localTransform.matrix.a, this.localTransform.matrix.b, this.localTransform.matrix.c, this.localTransform.matrix.d, this.localTransform.matrix.e, this.localTransform.matrix.f);
  }

  postRender(ctx) {
    if (!this.preRenderStarted || this.postRenderEnded) throw "Cannot post render, previously didn't pre render";
    this.preRenderStarted = false;
    ctx.restore();
    this.postRenderEnded = true;
  }

  renderChildren(ctx) {
    if (this.children) {
      for (let child of this.children) {
        child.render(ctx);
      }
    }
  }

  onRenderSelf(ctx) {
    return this;
  }
  /**Called internally, use/override onRenderSelf! */


  render(ctx) {
    this.preRender(ctx);
    this.renderChildren(ctx);
    this.onRenderSelf(ctx);
    this.postRender(ctx);
    return this;
  }

  traverse(traverseCallback) {
    if (!this.children) return this;

    for (let child of this.children) {
      traverseCallback(child);
      child.traverse(traverseCallback);
    }

    return this;
  }

}