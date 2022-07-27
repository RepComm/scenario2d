import { Drawing, EXPONENT_CSS_BODY_STYLES, EXPONENT_CSS_STYLES, Panel } from "@repcomm/exponent-ts";
import { Object2D } from "./mod.js";

async function main() {
  EXPONENT_CSS_STYLES.mount(document.head);
  EXPONENT_CSS_BODY_STYLES.mount(document.head);
  const container = new Panel().setId("container").mount(document.body);
  const scene = new Object2D();
  const drawing = new Drawing().setId("drawing").addRenderPass(ctx => {
    scene.render(ctx);
  }).mount(container);
  drawing.setHandlesResize(true);

  class TestBox extends Object2D {
    constructor() {
      super();
    }

    onRenderSelf(ctx) {
      ctx.fillRect(-50, -50, 100, 100);
      return this;
    }

  }

  let tb = new TestBox();
  tb.localTransform.position.set(100, 100);
  scene.add(tb);
  setInterval(() => {
    scene.localTransform.rotation -= 1; // tb.localTransform.rotation += 1;

    drawing.setNeedsRedraw(true);
  }, 1000 / 30);
}

main();