export interface Vec2Like {
    x: number;
    y: number;
}
export declare class Vec2 implements Vec2Like {
    x: number;
    y: number;
    constructor();
    set(x: number, y: number): this;
    getX(): number;
    getY(): number;
    setX(x: number): this;
    setY(y: number): this;
    /**Uses other vector's same named components, returns self*/
    add(other: Vec2Like): this;
    /**Uses other vector's same named components, returns self*/
    sub(other: Vec2Like): this;
    /**Uses other vector's same named components, returns self*/
    div(other: Vec2Like): this;
    /**Uses other vector's same named components, returns self*/
    mul(other: Vec2Like): this;
    copy(other: Vec2Like): this;
    divScalar(scalar: number): this;
    mulScalar(scalar: number): this;
    magnitude(): number;
    normalize(): Vec2;
    distance(other: Vec2Like): number;
    lerp(other: Vec2Like, by: number): this;
    centerOf(...vecs: Vec2Like[]): this;
    clamp(xmin: number, xmax: number, ymin: number, ymax: number): this;
}
