var EndTile = function(options) {
  options = options || {};
  TileEntity.apply(this, arguments);
  this.type = 'EndTile';
};

EndTile.prototype = new FloorTile();
