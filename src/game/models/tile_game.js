var TileGame = function(world) {
  Game.apply(this, arguments);
  this.cells = [];
};

TileGame.prototype = new Game();

TileGame.prototype.prebuildCells = function(cols, rows) {
  this.cells = [];
  for (var c = 0; c < cols; c++) {
    this.cells[c] = [];
    for (var r = 0; r < rows; r++) {
      this.cells[c][r] = [];
    }
  }
};

TileGame.prototype.addTileToCell = function(col, row, tile) {
  this.cells[col][row].push(tile);
};

TileGame.prototype.removeTileFromCell = function(col, row, tile) {
  var tile_index = this.findTileInCell(col, row, tile);
  if (tile_index !== null) {
    this.cells[col][row].splice(tile_index, 1);
  }
};

TileGame.prototype.swapTile = function(tile) {
  this.removeTileFromCell(tile.last_cell.col, tile.last_cell.row, tile);
  this.addTileToCell(tile.col, tile.row, tile);
};

TileGame.prototype.findTileInCell = function(col, row, tile) {
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

TileGame.prototype.isEmptyCell = function(col, row) {
  return this.cells[col][row].length === 0;
};
