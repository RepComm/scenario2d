# scenario2d
Scene graph, svg importer, transform math for html5 canvas<br/>

This lib has 0 dependencies.<br/>
It is not all-encompassing, it is not a renderer.<br/>
That task is left to implementation.

## Implemented Classes
- Resource : base class for other resources
- TextResource : loads text based files into string
- XmlResource : loads xml based files into Xml DOM trees, supports gradients (including inkscape, which does weird things that are accounted for)
- SceneResource : loads svg based files into Object2D tree (Scene2d)

- Object2d : base class, no display, has transform, children, parent, label, traverse children, overridable render
- PathObject2d : a singular svg path ( d attribute in svg markup ), fill, stroke, supports gradient
- Transform2d : scale, translate, rotation
- Vec2 : essential maths in oop

## Future additions
- SVG frame animation
- Animatable properties

## Using
To install with npm run<br>`npm install @repcomm/scenario2d`<br><br>
This package comes with typescript definitions, and should work in both typescript and javascript.

## Example Usage
TODO

## Compiling
TS -> JS is done using babel.js<br>
You can check out [ts-esm-babel-template](https://github.com/RepComm/ts-esm-babel-template)<br>
Which shows esmodule + typescript w/ babel -> js output<br><br>

or [webpack-ts-template](https://github.com/RepComm/webpack-ts-template) <br>
Which shows esmodule + typescript w/ babel + npm package integration<br>
<br>

To build you'll want to clone the repo<br>
`git clone https://github.com/RepComm/scenario2d.git`

Run `npm install` to get dependencies

Run `build.sh` (note: runs `npm run build`)
for compiling to javascript

----

For compiling ts defs you'll need [typescript](https://www.npmjs.com/package/typescript)<br>
Run `npm install -g typescript`

Run `build-types.sh`
