import {observable, customElement, containerless, bindable} from 'aurelia-framework';

@customElement('background')
@containerless
export class backgroundCustomElement {
  @observable duration = 5;

  loadSVG(url) {
    /* Snap.svg's load function is asynchronous, but doesn't use promises.
    *  So to make things work, wrap the load function in a promise, then use
    *  the Async/Await feature of ES7 to continue working synchronously.
    */
    let fragment;
    return new Promise(function(resolve, reject) {
      Snap.load(url, function(loadedFragment){
        fragment = loadedFragment;
        resolve(fragment);
      });
    });
  }

  styleTris(duration, fill, customProps) {
    let tris = this.svg.selectAll(".Triangles path");
    tris.forEach(function(el){
      // Delay ensures animations are not synchronous
      let delay = (Math.random() * (0.1 - (duration - 0.1)) + 0.1).toFixed(2);
      // TODO: Might need to add vendor-specific CSS properties
      let props = `animation: opacity ${duration}s ${delay}s infinite;`;
      el.attr({
        fill: '#fff',
        style: props
      });
    });
  }

  async attached() {
    // Setup
    let svg = this.svg;
    let fragment = await this.loadSVG("./src/app/components/background/background.svg");
    let styles = fragment.select("style");
    let bgFrag = fragment.select("#Background");
    let tilesFrag = fragment.select("#Tiles");
    let patternFrag = fragment.select(".Pattern");
    let largeOutline = fragment.selectAll(".Large_Outline");
    let smallOutline = fragment.selectAll(".Small_Outline");
    let bg = fragment.select("#Background rect");
    let gradient = svg.gradient("L(0, 100, 0, 0)#662D91-#EE2A7B");

    // Set some styles
    bg.attr({
      fill: gradient
    });

    smallOutline.forEach(function(el){
      el.attr({
        fill: "#fff",
        "fill-opacity": 0.40
      })
    });

    largeOutline.forEach(function(el){
      el.attr({
        fill: "#fff",
        "fill-opacity": 0.40
      })
    });

    // Repetition

    let tile = function(fragment, repeat){
      let pattern = fragment.select(".Pattern");
      pattern.attr({
        transform: `scale(${(1 / repeat)})`
      });
      let bb = pattern.getBBox(); // Doesn't seem to work with fragments?
      // TODO: Replace hardcoded values with computed ones
      let originX = (0 + (6 / repeat)); // (bb.x + (6 / repeat))
      let originY = 0; // bb.y
      let height = (83.14 / repeat); // (bb.h / repeat)
      let width = (84 / repeat); // (bb.w / repeat)
      for (let row=0; row<repeat; row++) {
         for (let col=0; col<repeat; col++) {
           if (row || col) { // Skip the first row/column, this creates duplicates
             // Clone the pattern, apply the proper scale and move into position
             let clone = pattern.clone();
             let x =row*width+(originX * (row + row));
             let y = col*height;
             let transformation = `translate(${x},${y}), scale(${(1 / repeat)})`;
             clone.transform(transformation);
           }
         }
      }
      // Move the entire group to the left to account for the spillover
      let tiles = fragment.select("#Tiles");
      tiles.attr({
        transform: `translate(${-6})`
      })
    };

    // Note: higher repeat values increase page load times and cpu usage
    tile(fragment, 6);

    // Animation
    /*
    let tris = fragment.selectAll(".Triangles path");

    tris.forEach(function(el){
      let duration = 5;
      // Delay ensures animations are not synchronous
      let delay = (Math.random() * (0.1 - (duration - 0.1)) + 0.1).toFixed(2);
      // TODO: Might need to add vendor-specific CSS properties
      let props = `animation: opacity ${duration}s ${delay}s infinite;`;
      el.attr({
        fill: "#fff",
        style: props
      });
    });
    */

    // Append to page

    svg.append(styles)
       .append(bgFrag)
       .append(tilesFrag);

    this.styleTris(5);
  }

  durationChanged(newValue, oldValue) {
    this.styleTris(newValue);
  }
}
