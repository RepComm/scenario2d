import { Vec2 } from "./vec.js";
export interface MatrixDecomposition {
    x: number;
    y: number;
    r: number;
    sx: number;
    sy: number;
    skx: number;
    sky: number;
}
export interface MatrixLike {
    a: number;
    b: number;
    c: number;
    d: number;
    e: number;
    f: number;
}
export declare class Matrix {
    data: Array<number>;
    static tempTransformMatrix: Matrix;
    static tempRotationMatrix: Matrix;
    static Index: {
        a: 0;
        b: 1;
        c: 2;
        d: 3;
        e: 4;
        f: 5;
    };
    constructor();
    identity(): this;
    decompose(decomp: MatrixDecomposition): void;
    copy(from: MatrixLike): this;
    isIdentityOrTranslation(): boolean;
    get a(): number;
    set a(v: number);
    get b(): number;
    set b(v: number);
    get c(): number;
    set c(v: number);
    get d(): number;
    set d(v: number);
    get e(): number;
    set e(v: number);
    get f(): number;
    set f(v: number);
    det(): number;
    /**Calculates the inverse matrix and outputs to the 'destination' matrix, which is self by default
     *
     * @param destination
     * @returns
     */
    inverse(destination?: Matrix): this;
    rotate(theta: number): this;
    scale(sx: number): this;
    multiply(b: Matrix): this;
    transform(a2: number, b2: number, c2: number, d2: number, e2: number, f2: number): void;
    translate(tx: number, ty: number): void;
    translateRight(tx: any, ty: any): this;
    equal(m: Matrix, p?: number): boolean;
    set(a: number, b: number, c: number, d: number, e: number, f: number): this;
    toString(): string;
    transformPoint(point: Vec2): this;
    trs(t: Matrix, r: Matrix, s: Matrix): void;
}
