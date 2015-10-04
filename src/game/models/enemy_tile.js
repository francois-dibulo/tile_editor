var EnemyTile = function(options) {
  options = options || {};
  MoveWaypointTile.apply(this, arguments);
  this.type = 'EnemyTile';
};

EnemyTile.prototype = new MoveWaypointTile();

EnemyTile.prototype.hasCollideWith = function(other_tile) {
  console.log("Collides", other_tile.type);
};
