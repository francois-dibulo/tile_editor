var WallTile = function(options) {
  options = options || {};
  TileEntity.apply(this, arguments);
  this.type = 'WallTile';
  this.is_walkable = false;
  this.is_static = true;
};

WallTile.prototype = new TileEntity();
