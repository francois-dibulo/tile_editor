var TileEntity = function(options) {
  if (!options) return;
  options = options || {};
  this.row = 0;
  this.col = 0;
  this.is_walkable = true;
  this.trigger_conditions = [];
  MoveEntity.apply(this, arguments);
  this.type = 'TileEntity';
  this.init_cell = {
    row: this.row,
    col: this.col
  };
  this.last_cell = {
    row: this.row,
    col: this.col
  };
};

TileEntity.prototype = new MoveEntity();

TileEntity.prototype.reset = function() {
  this.setTilePosition(this.init_cell.row, this.init_cell.col, true);
};

TileEntity.prototype.setTilePosition = function(row, col, set_sprite) {
  this.last_cell = {
    row: this.row,
    col: this.col
  };
  this.row = row;
  this.col = col;
  this.position.x = this.col * this.size.width;
  this.position.y = this.row * this.size.height;
  if (set_sprite) {
    this.graphic.setPosition(this.position.x, this.position.y);
  }
  this.emit('moved');
};
