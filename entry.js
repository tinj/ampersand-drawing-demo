var Model      = require('./model');
var CanvasView = require('./canvas-view');
setTimeout(function () {
  window.cv = new CanvasView({
      el: document.getElementById('drawing'),
      model: new Model()
  });
}, 100);