import { Object2D } from "./object.js";
import { GradientDef } from "./gradients.js";
export declare class PathObject2D extends Object2D {
    path: Path2D;
    private _d;
    fillStyle: string | CanvasGradient | CanvasPattern;
    strokeStyle: string | CanvasGradient | CanvasPattern;
    lineWidth: number;
    doStroke: boolean;
    doFill: boolean;
    fillGradientDef: GradientDef;
    strokeGradientDef: GradientDef;
    constructor();
    enableStroke(enable?: boolean): PathObject2D;
    enableFill(enable?: boolean): PathObject2D;
    private setPath;
    set d(str: string);
    get d(): string;
    private getPath;
    hasPath(): boolean;
    setGradientFill(gradDef: GradientDef): Object2D;
    setGradientStroke(gradDef: GradientDef): Object2D;
    render(ctx: CanvasRenderingContext2D): this;
}
