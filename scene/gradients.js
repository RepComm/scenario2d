function pxToMm(px, dpi) {
  return px * 25.4 / dpi;
}

function mmToPx(mm, dpi) {
  return mm / 25.4 * dpi;
} //I don't know why, but this decimal was needed to make it work


function transformCoordinate(c) {
  // return c * 3.788225;
  return c;
}

export class GradientDef {
  constructor() {
    this.stops = new Map();
    this.isDirty = true;
  }

  setStop(offset, stopDef) {
    this.stops.set(offset, stopDef);
    this.isDirty = true;
  }

  getStop(index) {
    return this.stops.get(index);
  }

  stopsForEach(cb) {
    this.stops.forEach(cb);
  }

  compile(ctx) {
    this.x1 = transformCoordinate(this.x1);
    this.y1 = transformCoordinate(this.y1);
    this.x2 = transformCoordinate(this.x2);
    this.y2 = transformCoordinate(this.y2);
    this.compiled = ctx.createLinearGradient(this.x1, this.y1, this.x2, this.y2);
    this.stops.forEach((def, offset) => {
      this.compiled.addColorStop(offset, def.color);
    });
    this.isDirty = false;
    return this.compiled;
  }

  get needsCompile() {
    return this.isDirty;
  }

  getCompiled() {
    return this.compiled;
  }

}
export class GradientBank {
  constructor() {
    this.gradients = new Map();
  }

  setGradient(id, def) {
    this.gradients.set(id, def);
    return this;
  }

  getGradient(id) {
    return this.gradients.get(id);
  }

  hasGradient(id) {
    return this.gradients.has(id);
  }

  gradientsForEach(cb) {
    this.gradients.forEach(cb);
  }

}