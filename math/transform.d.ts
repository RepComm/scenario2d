import { Matrix, MatrixDecomposition } from "./matrix.js";
import { Vec2 } from "./vec.js";
export declare class Transform2d {
    position: Vec2;
    rotation: number;
    scale: number;
    matrix: Matrix;
    static tempDecomp: MatrixDecomposition;
    constructor();
    renderMatrix(): this;
    copy(other: Transform2d): this;
    unrenderMatrix(): this;
}
