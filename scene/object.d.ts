import { Transform2d } from "../math/transform.js";
export interface Object2DTraverseCallback {
    (child: Object2D): void;
}
export declare class Object2D {
    parent: Object2D;
    localTransform: Transform2d;
    globalTransform: Transform2d;
    children: Set<Object2D>;
    preRenderStarted: boolean;
    postRenderEnded: boolean;
    label: string;
    constructor();
    getChildByLabel(label: string, recursive?: boolean): Object2D;
    hasChildren(): boolean;
    has(child: Object2D): boolean;
    remove(child: Object2D, alertChild?: boolean): this;
    hasParent(): boolean;
    removeSelf(alertParent?: boolean): Object2D;
    setParent(parent: Object2D, alertParent?: boolean): this;
    add(child: Object2D, alertChild?: boolean): this;
    renderGlobalTransform(): void;
    preRender(ctx: CanvasRenderingContext2D): void;
    postRender(ctx: CanvasRenderingContext2D): void;
    renderChildren(ctx: CanvasRenderingContext2D): void;
    onRenderSelf(ctx: CanvasRenderingContext2D): this;
    /**Called internally, use/override onRenderSelf! */
    render(ctx: CanvasRenderingContext2D): this;
    traverse(traverseCallback: Object2DTraverseCallback): this;
}
