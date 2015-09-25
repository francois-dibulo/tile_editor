var PixiTileGame = function(world) {
  Game.apply(this, arguments);
  this.cells = [];
};

PixiTileGame.prototype = new PixiGame();

PixiTileGame.prototype.prebuildCells = function(cols, rows) {
  this.cells = [];
  for (var c = 0; c < cols; c++) {
    this.cells[c] = [];
    for (var r = 0; r < rows; r++) {
      this.cells[c][r] = [];
    }
  }
};

PixiTileGame.prototype.addTileToCell = function(col, row, tile) {
  this.cells[col][row].push(tile);
};

PixiTileGame.prototype.removeTileFromCell = function(col, row, tile) {
  var tile_index = this.findTileInCell(col, row, tile);
  if (tile_index !== null) {
    this.cells[col][row].splice(tile_index, 1);
  }
};

PixiTileGame.prototype.swapTile = function(tile) {
  this.removeTileFromCell(tile.last_cell.col, tile.last_cell.row, tile);
  this.addTileToCell(tile.col, tile.row, tile);
};

PixiTileGame.prototype.findTileInCell = function(col, row, tile) {
  var tiles = this.cells[col][row];
  var result = null;
  for (var i = 0; i < tiles.length; i++) {
    if (tiles[i].id === tile.id) {
      result = {
        tile: tiles[i],
        index: i
      }
    }
  }
  return result;
};

PixiTileGame.prototype.isEmptyCell = function(col, row) {
  return this.cells[col][row].length === 0;
};
