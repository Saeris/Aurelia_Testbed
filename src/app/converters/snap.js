import Snap from 'imports-loader?this=>window,fix=>module.exports=0!snapsvg/dist/snap.svg.js';

export class AsSnapValueConverter {
  fromView(svg) {
    return Snap(svg);
  }
}
