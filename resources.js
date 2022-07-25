import { GradientDef, GradientBank } from "./scene/gradients.js";
import { Object2D } from "./scene/object.js";
import { PathObject2D } from "./scene/pathobject.js";
const textDecoder = new TextDecoder();
export class Resource {
  static loadFromArrayBuffer(buffer, premadeResource) {
    return new Promise(async function (_resolve, _reject) {
      let result;

      if (premadeResource) {
        result = premadeResource;
      } else {
        result = new Resource();
      }

      result.arrayBuffer = buffer;

      _resolve(result);
    });
  }

  static load(uri, premadeResource) {
    return new Promise(async function (resolve, reject) {
      let result;

      if (premadeResource) {
        result = premadeResource;
      } else {
        result = new Resource();
      }

      result.uri = uri;
      result.response = await fetch(uri);
      resolve(result);
    });
  }

}
export class TextResource extends Resource {
  static loadFromArrayBuffer(buffer, premadeResource) {
    return new Promise(async function (_resolve, _reject) {
      let result;

      if (premadeResource) {
        result = premadeResource;
      } else {
        result = new TextResource();
      }

      result = await Resource.loadFromArrayBuffer(buffer, result);
      result.text = await textDecoder.decode(result.arrayBuffer);

      _resolve(result);
    });
  }

  static load(uri, premadeResource) {
    return new Promise(async function (resolve, reject) {
      let result;

      if (premadeResource) {
        result = premadeResource;
      } else {
        result = new TextResource();
      }

      result = await Resource.load(uri, result);
      result.text = await result.response.text();
      resolve(result);
    });
  }

}
export class XmlResource extends TextResource {
  static loadFromArrayBuffer(buffer, premadeResource, type = "text/xml") {
    return new Promise(async function (_resolve, _reject) {
      let result;

      if (premadeResource) {
        result = premadeResource;
      } else {
        result = new XmlResource();
      }

      result = await TextResource.loadFromArrayBuffer(buffer, result); // result = await TextResource.load(uri, result) as XmlResource;

      result.xml = XmlResource.DOM_PARSER.parseFromString(result.text, type);

      _resolve(result);
    });
  }

  static load(uri, premadeResource, type = "text/xml") {
    return new Promise(async function (resolve, reject) {
      let result;

      if (premadeResource) {
        result = premadeResource;
      } else {
        result = new XmlResource();
      }

      result = await TextResource.load(uri, result);
      result.xml = XmlResource.DOM_PARSER.parseFromString(result.text, type);
      resolve(result);
    });
  }

}
XmlResource.DOM_PARSER = new DOMParser();

/**This one is going to need work if it means to cover edge cases..
 * @param url
 */
function parseFillUrl(url) {
  let start = url.indexOf("#");
  let end = url.lastIndexOf("\"");
  let id = url.substring(start + 1, end);
  return id;
}

export class SVGResource extends XmlResource {
  constructor() {
    super();
    this.gradientBank = new GradientBank();
  } //https://stackoverflow.com/a/60592373


  static decomposeDomMatrix(m) {
    let E = (m.a + m.d) / 2;
    let F = (m.a - m.d) / 2;
    let G = (m.c + m.b) / 2;
    let H = (m.c - m.b) / 2;
    let Q = Math.sqrt(E * E + H * H);
    let R = Math.sqrt(F * F + G * G);
    let a1 = Math.atan2(G, F);
    let a2 = Math.atan2(H, E);
    let theta = (a2 - a1) / 2;
    let phi = (a2 + a1) / 2; // The requested parameters are then theta, 
    // sx, sy, phi,

    return {
      translateX: m.e,
      translateY: m.f,
      rotate: -phi * 180 / Math.PI,
      scaleX: Q + R,
      scaleY: Q - R,
      skew: -theta * 180 / Math.PI
    };
  }

  static copySvgTransformToObject2D(node, obj) {
    if (node.transform.baseVal.numberOfItems < 1) return;
    let matrix = node.transform.baseVal.getItem(0).matrix;
    obj.localTransform.matrix.copy(matrix); // let decomp = SceneResource.decomposeDomMatrix(
    //   matrix
    // );
    // obj.localTransform.position.set(
    //   decomp.translateX,
    //   decomp.translateY
    // );
    // obj.localTransform.rotation = decomp.rotate;
    // obj.localTransform.scale = decomp.scaleX;
  }

  static parseSvgGroup(scene, node, sceneGradientBank) {
    let result = new Object2D();
    SVGResource.copySvgTransformToObject2D(node, result);
    SVGResource.parseNodeChildren(scene, node, result, sceneGradientBank);
    return result;
  }

  static parseSvgPath(scene, node, sceneGradientBank) {
    let result = new PathObject2D();
    SVGResource.copySvgTransformToObject2D(node, result);
    SVGResource.parseNodeChildren(scene, node, result, sceneGradientBank);
    let dPath = node.getAttribute("d"); // let path: Path2D;

    if (dPath) {// path = new Path2D(dPath);
    } else {
      // path = new Path2D();
      console.warn("Warning, path had no 'd' attribute. Empty Path2D", dPath);
    } // result.setPath(path);


    result.d = dPath;

    if (node.style.fill) {
      if (node.style.fill.trim().startsWith("url")) {
        let url = parseFillUrl(node.style.fill);

        if (sceneGradientBank.hasGradient(url)) {
          let gradDef = sceneGradientBank.getGradient(url);
          result.fillStyle = undefined;
          result.setGradientFill(gradDef);
        } else {
          console.warn("Couldn't find gradient for id", url, "extracted from url", node.style.fill);
        }
      } else if (node.style.fill == "none") {
        result.enableFill(false);
      } else {
        result.fillStyle = node.style.fill;
      }
    }

    if (node.style.stroke) {
      if (node.style.stroke.trim().startsWith("url")) {
        let url = parseFillUrl(node.style.fill);

        if (sceneGradientBank.hasGradient(url)) {
          let gradDef = sceneGradientBank.getGradient(url);
          result.strokeStyle = undefined;
          result.setGradientStroke(gradDef);
        } else {
          console.warn("Couldn't find gradient for id", url, "extracted from url", node.style.fill);
        }
      } else if (node.style.stroke == "none") {
        result.enableStroke(false);
      } else {
        result.strokeStyle = node.style.stroke;
      }
    }

    if (node.style.strokeWidth) {
      result.lineWidth = parseFloat(node.style.strokeWidth);

      if (result.lineWidth < 0.8) {
        result.enableStroke(false);
      }
    }

    return result;
  }

  static parseSvgGradient(node, predefinedGrad) {
    let result;

    if (predefinedGrad) {
      result = predefinedGrad;
    } else {
      result = new GradientDef();
    }

    node.x1.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_NUMBER);
    node.y1.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_NUMBER);
    node.x2.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_NUMBER);
    node.y2.baseVal.convertToSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_NUMBER);
    if (!result.x1) result.x1 = node.x1.baseVal.value;
    if (!result.y1) result.y1 = node.y1.baseVal.value;
    if (!result.x2) result.x2 = node.x2.baseVal.value;
    if (!result.y2) result.y2 = node.y2.baseVal.value;
    result.copyFrom = node.href.baseVal; //Remove hashtag

    if (result.copyFrom.startsWith("#")) result.copyFrom = result.copyFrom.substring(1);

    for (let child of node.children) {
      if (child instanceof SVGStopElement) {
        result.setStop(child.offset.baseVal, {
          color: child.style.stopColor
        });
      }
    }

    return result;
  }

  static parseNodeChildren(scene, node, parent, sceneGradientBank) {
    let obj;

    for (let child of node.children) {
      if (child instanceof SVGGElement) {
        obj = SVGResource.parseSvgGroup(scene, child, sceneGradientBank);
        obj.label = child.id;
        parent.add(obj);
      } else if (child instanceof SVGPathElement) {
        obj = SVGResource.parseSvgPath(scene, child, sceneGradientBank);
        obj.label = child.id;
        parent.add(obj);
      } else if (child instanceof SVGLinearGradientElement) {
        sceneGradientBank.setGradient(child.id, SVGResource.parseSvgGradient(child));
      } else if (child instanceof SVGDefsElement) {
        SVGResource.parseNodeChildren(scene, child, parent, sceneGradientBank);
      }
    }
  }

  static loadFromArrayBuffer(buffer, premadeResource, type = "image/svg+xml") {
    return new Promise(async function (_resolve, _reject) {
      let result;

      if (premadeResource) {
        result = premadeResource;
      } else {
        result = new SVGResource();
        result.gradientBank = new GradientBank();
      }

      result = await XmlResource.loadFromArrayBuffer(buffer, result);
      result.root = new Object2D();
      let svgs = result.xml.getElementsByTagName("svg");
      let firstSvg = svgs[0];
      result.width = firstSvg.width.baseVal.value;
      result.height = firstSvg.height.baseVal.value;

      if (svgs.length < 1) {
        console.warn("No svg elements found in document, scene imported is empty!");
      } else {
        SVGResource.parseNodeChildren(result.root, firstSvg, result.root, result.gradientBank);
      }

      result.gradientBank.gradientsForEach((def, id) => {
        if (def.copyFrom) {
          let gradNode = firstSvg.getElementById(def.copyFrom);

          if (!gradNode) {
            console.warn("Couldn't use href of linear gradient, no gradient found by id", def.copyFrom);
          } else {
            if (gradNode instanceof SVGLinearGradientElement) {
              SVGResource.parseSvgGradient(gradNode, def);
            } else {
              console.warn("Couldn't use href of linear gradient as the element it points to by id was not a linear gradient", gradNode);
            }
          }
        }
      });

      _resolve(result);
    });
  }

  static load(uri, premadeResource, type = "image/svg+xml") {
    return new Promise(async function (resolve, reject) {
      let result;

      if (premadeResource) {
        result = premadeResource;
      } else {
        result = new SVGResource();
      }

      result = await XmlResource.load(uri, result);
      result.root = new Object2D();
      let svgs = result.xml.getElementsByTagName("svg");
      let firstSvg = svgs[0];
      result.width = firstSvg.width.baseVal.value;
      result.height = firstSvg.height.baseVal.value;

      if (svgs.length < 1) {
        console.warn("No svg elements found in document, scene imported is empty!");
      } else {
        SVGResource.parseNodeChildren(result.root, firstSvg, result.root, result.gradientBank);
      }

      result.gradientBank.gradientsForEach((def, id) => {
        if (def.copyFrom) {
          let gradNode = firstSvg.getElementById(def.copyFrom);

          if (!gradNode) {
            console.warn("Couldn't use href of linear gradient, no gradient found by id", def.copyFrom);
          } else {
            if (gradNode instanceof SVGLinearGradientElement) {
              SVGResource.parseSvgGradient(gradNode, def);
            } else {
              console.warn("Couldn't use href of linear gradient as the element it points to by id was not a linear gradient", gradNode);
            }
          }
        }
      });
      resolve(result);
    });
  }

}