
export interface GradientStopDef {
  color: string;
}

function pxToMm (px: number, dpi: number): number {
  return ( px * 25.4 ) / dpi;
}

function mmToPx (mm: number, dpi: number): number {
  return (mm / 25.4) * dpi;
}

//I don't know why, but this decimal was needed to make it work
function transformCoordinate (c: number): number {
  // return c * 3.788225;
  return c;
}

type GradientStopsMap = Map<number, GradientStopDef>;

export interface GradientStopsForEachCallback {
  (stop: GradientStopDef, id: number): void;
}

export class GradientDef {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  copyFrom?: string;
  compiled: CanvasGradient;

  stops: GradientStopsMap;
  isDirty: boolean;

  constructor () {
    this.stops = new Map();
    this.isDirty = true;
  }
  setStop (offset: number, stopDef: GradientStopDef) {
    this.stops.set(offset, stopDef);
    this.isDirty = true;
  }
  getStop (index: number): GradientStopDef {
    return this.stops.get(index);
  }
  stopsForEach (cb: GradientStopsForEachCallback) {
    this.stops.forEach(cb);
  }
  compile (ctx: CanvasRenderingContext2D): CanvasGradient {
    this.x1 = transformCoordinate(this.x1);
    this.y1 = transformCoordinate(this.y1);
    this.x2 = transformCoordinate(this.x2);
    this.y2 = transformCoordinate(this.y2);

    this.compiled = ctx.createLinearGradient(
      this.x1, this.y1,
      this.x2, this.y2
    );
    this.stops.forEach((def, offset)=>{
      this.compiled.addColorStop(
        offset, def.color
      )
    });
    this.isDirty = false;
    return this.compiled;
  }
  get needsCompile (): boolean {
    return this.isDirty;
  }
  getCompiled (): CanvasGradient {
    return this.compiled;
  }
}

type GradientDefsMap = Map<string, GradientDef>;

export interface GradientForEachCallback {
  (grad: GradientDef, id: string): void;
}

export class GradientBank {
  gradients: GradientDefsMap;
  width: number;
  height: number;
  constructor () {
    this.gradients = new Map();
  }
  setGradient(id: string, def: GradientDef): this {
    this.gradients.set(id, def);
    return this;
  }
  getGradient (id: string): GradientDef {
    return this.gradients.get(id);
  }
  hasGradient (id: string): boolean {
    return this.gradients.has(id);
  }
  gradientsForEach (cb: GradientForEachCallback){
    this.gradients.forEach(cb);
  }
}