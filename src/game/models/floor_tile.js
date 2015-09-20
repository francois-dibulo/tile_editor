var FloorTile = function(options) {
  options = options || {};
  MoveWaypointTile.apply(this, arguments);
  this.type = 'FloorTile';
};

FloorTile.prototype = new MoveWaypointTile();
