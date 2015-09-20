var TileEntity = function(options) {
  if (!options) return;
  options = options || {};
  this.row = 0;
  this.col = 0;
  this.is_walkable = true;
  Entity.apply(this, arguments);
  this.type = 'TileEntity';
};

TileEntity.prototype = new Entity();
