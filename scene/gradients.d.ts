export interface GradientStopDef {
    color: string;
}
declare type GradientStopsMap = Map<number, GradientStopDef>;
export interface GradientStopsForEachCallback {
    (stop: GradientStopDef, id: number): void;
}
export declare class GradientDef {
    x1?: number;
    y1?: number;
    x2?: number;
    y2?: number;
    copyFrom?: string;
    compiled: CanvasGradient;
    stops: GradientStopsMap;
    isDirty: boolean;
    constructor();
    setStop(offset: number, stopDef: GradientStopDef): void;
    getStop(index: number): GradientStopDef;
    stopsForEach(cb: GradientStopsForEachCallback): void;
    compile(ctx: CanvasRenderingContext2D): CanvasGradient;
    get needsCompile(): boolean;
    getCompiled(): CanvasGradient;
}
declare type GradientDefsMap = Map<string, GradientDef>;
export interface GradientForEachCallback {
    (grad: GradientDef, id: string): void;
}
export declare class GradientBank {
    gradients: GradientDefsMap;
    width: number;
    height: number;
    constructor();
    setGradient(id: string, def: GradientDef): this;
    getGradient(id: string): GradientDef;
    hasGradient(id: string): boolean;
    gradientsForEach(cb: GradientForEachCallback): void;
}
export {};
