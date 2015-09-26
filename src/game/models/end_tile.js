var EndTile = function(options) {
  options = options || {};
  FloorTile.apply(this, arguments);
  this.type = 'EndTile';
};

EndTile.prototype = new FloorTile();
