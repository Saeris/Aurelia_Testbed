import {observable, customElement, containerless, bindable} from 'aurelia-framework';

@customElement('background')
@containerless
export class backgroundCustomElement {
  @observable duration = 5;
  @observable tiles = 6;

  loadSVG(url) {
    /*
    *  Snap.svg's load function is asynchronous, but doesn't use promises.
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
      el.attr({
        style: `animation: opacity ${duration}s ${delay}s infinite;`
      });
    });
  }

  clearTiles() {
    let tiles = this.svg.select("#Tiles");
    let pattern = this.svg.selectAll(".Pattern");
    let basePattern = this.svg.select("#Pattern");
    pattern.forEach(function(el){
      if(el !== basePattern){
        el.remove();
      }
    });
    basePattern.attr({
      transform: "scale(1)"
    });
  }

  tilePattern(repeat) {
    let pattern = this.svg.select("#Pattern");
    pattern.attr({
      transform: `scale(${(1 / repeat)})`
    });
    let bb = pattern.getBBox(); // Doesn't seem to work with fragments?
    for (let row=0; row<repeat; row++) {
       for (let col=0; col<repeat; col++) {
         if (row || col) { // Skip the first row/column, this creates duplicates
           // Clone the pattern, apply the proper scale and move into position
           let clone = pattern.clone();
           let x =row*bb.w+(bb.x * (row + row));
           let y = col*bb.h;
           let transformation = `translate(${x},${y}), scale(${(1 / repeat)})`;
           clone.transform(transformation);
         }
       }
    }
    // Move the entire group to the left to account for the spillover
    let tiles = this.svg.select("#Tiles");
    tiles.attr({
      transform: `translate(${-6})`
    });
  }

  async attached() {
    // Setup
    let svg = this.svg;
    let fragment = await this.loadSVG("./src/app/components/background/background.svg");
    let styles = fragment.select("style");
    let bgFrag = fragment.select("#Background");
    let tilesFrag = fragment.select("#Tiles");
    let bg = fragment.select("#Background rect");
    let gradient = svg.gradient("L(0, 100, 0, 0)#662D91-#EE2A7B");

    // Set some styles
    bg.attr({
      fill: gradient
    });

    svg.append(styles)
       .append(bgFrag)
       .append(tilesFrag);

    this.tilePattern(this.tiles);

    this.styleTris(this.duration);
  }

  durationChanged(newValue, oldValue) {
    this.styleTris(newValue);
  }

  tilesChanged(newValue, oldValue) {
    this.clearTiles();
    this.tilePattern(newValue);
  }
}
