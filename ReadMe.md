# scenario2d
Zero dependencies 2d scene graph for web canvas

## Implemented Classes
- Resource, TextResource, XmlResource, SvgResource

- Object2d (base class for scene objs)
- PathObject2d - svg `d` attribute equivalent
- Transform2d - scale, translate, rotation
- Vec2

## Using
To install with npm run<br>`npm install @repcomm/scenario2d`<br><br>
This package comes with typescript definitions, and should work in both typescript and javascript.

## Example Usage
See [index.html](./index.html) and [index.js](./index.js) <br/>

Note: Example uses my other library [exponent-ts](https://github.com/RepComm/exponent-ts)<br/>

As well as [es-module-shims.js](https://github.com/guybedford/es-module-shims) to load node_modules using import maps directly in the browser.

This is to reduce build time to < 1s<br/>

hence the extra boilerplate in index.html

## Compiling

To build you'll want to clone the repo<br>
`git clone https://github.com/RepComm/scenario2d.git`

Run `npm install` to get dependencies

Run `npm run build`
