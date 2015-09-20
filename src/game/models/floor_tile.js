var FloorTile = function(options) {
  options = options || {};
  TileEntity.apply(this, arguments);
  this.type = 'FloorTile';
};

FloorTile.prototype = new TileEntity();
