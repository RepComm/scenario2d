import { GradientDef, GradientBank } from "./scene/gradients.js";
import { Object2D } from "./scene/object.js";
import { PathObject2D } from "./scene/pathobject.js";
export declare class Resource {
    response: Response;
    uri: string;
    arrayBuffer: ArrayBuffer;
    static loadFromArrayBuffer(buffer: ArrayBuffer, premadeResource?: Resource): Promise<Resource>;
    static load(uri: string, premadeResource?: Resource): Promise<Resource>;
}
export declare class TextResource extends Resource {
    text: string;
    static loadFromArrayBuffer(buffer: ArrayBuffer, premadeResource: TextResource): Promise<TextResource>;
    static load(uri: string, premadeResource?: TextResource): Promise<TextResource>;
}
export declare class XmlResource extends TextResource {
    static DOM_PARSER: DOMParser;
    xml: Document;
    static loadFromArrayBuffer(buffer: ArrayBuffer, premadeResource?: XmlResource, type?: DOMParserSupportedType): Promise<XmlResource>;
    static load(uri: string, premadeResource?: XmlResource, type?: DOMParserSupportedType): Promise<XmlResource>;
}
export interface DOMMatrixDecomp {
    translateX: number;
    translateY: number;
    rotate: number;
    scaleX: number;
    scaleY: number;
    skew: number;
}
export declare class SVGResource extends XmlResource {
    root: Object2D;
    width: number;
    height: number;
    gradientBank: GradientBank;
    constructor();
    static decomposeDomMatrix(m: DOMMatrix): DOMMatrixDecomp;
    static copySvgTransformToObject2D(node: SVGGElement, obj: Object2D): void;
    static parseSvgGroup(scene: Object2D, node: SVGGElement, sceneGradientBank: GradientBank): Object2D;
    static parseSvgPath(scene: Object2D, node: SVGPathElement, sceneGradientBank: GradientBank): PathObject2D;
    static parseSvgGradient(node: SVGLinearGradientElement, predefinedGrad?: GradientDef): GradientDef;
    static parseNodeChildren(scene: Object2D, node: Element, parent: Object2D, sceneGradientBank: GradientBank): void;
    static loadFromArrayBuffer(buffer: ArrayBuffer, premadeResource?: SVGResource, type?: DOMParserSupportedType): Promise<SVGResource>;
    static load(uri: string, premadeResource?: SVGResource, type?: DOMParserSupportedType): Promise<SVGResource>;
}
