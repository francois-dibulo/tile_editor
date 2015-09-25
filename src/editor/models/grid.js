var Grid = function(cols, rows, size) {
  this.cols = cols;
  this.rows = rows;
  this.size = size;
  this.width = cols * size;
  this.height = rows * size;
  this.line_color = 0x222222;
  this.container = new PIXI.Container();
};

Grid.prototype.getContainer = function() {
  return this.container;
};

Grid.prototype.clear = function() {
  return this.container.removeChildren();
};

Grid.prototype.hide = function() {
  this.getContainer().visible = false;
};

Grid.prototype.show = function() {
  this.getContainer().visible = true;
};

Grid.prototype.createLines = function(rows, cols, size) {
  rows = rows || this.rows;
  cols = cols || this.cols;
  size = size || this.size;
  height = rows * size;
  width = cols * size;
  var x = 0;
  var y = 0;

  for (var c = 0; c < cols; c++) {
    var graphic = new PIXI.Graphics();
    graphic.lineStyle(1, this.line_color, 1);
    x = size * c;
    graphic.moveTo(x, y);
    graphic.lineTo(x, height);
    this.container.addChild(graphic);
  }

  x = 0;
  y = 0;
  for (var r = 0; r < rows; r++) {
    var graphic = new PIXI.Graphics();
    graphic.lineStyle(1, this.line_color, 1);
    y = size * r;
    graphic.moveTo(x, y);
    graphic.lineTo(width, y);
    this.container.addChild(graphic);
  }
};
