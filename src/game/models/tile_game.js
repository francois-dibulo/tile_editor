var PixiTileGame = function(world) {
  GE.PixiGame.apply(this, arguments);
  this.cells = [];
};

PixiTileGame.prototype = new GE.PixiGame();

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

PixiTileGame.prototype.checkCollision = function(tile) {
  var tiles_in_cell = this.cells[tile.col][tile.row];
  for (var i = 0; i < tiles_in_cell.length; i++) {
    var other_tile = tiles_in_cell[i];
    if (tile.id !== other_tile.id) {
      if (tile.canCollide() && other_tile.canCollide()) {
        console.log(tile.col, tile.row, tiles_in_cell);
        tile.hasCollideWith(other_tile);
        other_tile.hasCollideWith(tile);
      }
    }
  }
};
