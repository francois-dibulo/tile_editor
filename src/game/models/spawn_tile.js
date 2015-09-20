var SpawnTile = function(options) {
  options = options || {};
  TileEntity.apply(this, arguments);
  this.type = 'SpawnTile';
};

SpawnTile.prototype = new FloorTile();
