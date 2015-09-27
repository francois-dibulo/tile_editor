var MoveWaypointTile = function(options) {
  options = options || {};
  this.move_type = MoveWaypointTile.MoveType.Once;
  this.col = 0;
  this.row = 0;
  TileEntity.apply(this, arguments);
  this.type = 'MoveWaypointTile';
  // By Waypoints
  this.current_target_point = null;
  this.current_wp_index = 0;
  this.target_index = 0;
  this.waypoint_queue = [];
  this.do_loop = false;
  this.vel = {
    x: 1,
    y: 1
  };
  this.move_offset = this.size.width / 2;
  this.on(Entity.Event.onLive, this.initQueue.bind(this));
};

MoveWaypointTile.MoveType = {
  Once: 'once',
  Loop: 'loop',
  Yoyo: 'yoyo',
  Circular: 'circular'
};

MoveWaypointTile.prototype = new TileEntity();

MoveWaypointTile.prototype.idle = function() {};

MoveWaypointTile.prototype.reset = function() {
  this.current_target_point = null;
  this.current_wp_index = 0;
  this.target_index = 0;
  this.setTilePosition(this.init_cell.row, this.init_cell.col, true);
};

MoveWaypointTile.prototype.setTilePosition = function(row, col, set_sprite) {
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

MoveWaypointTile.prototype.addWaypoint = function(point) {
  point.wait = 0;
  this.waypoint_queue.push(point);
};

MoveWaypointTile.prototype.clearWaypoints = function() {
  this.waypoint_queue = [];
};

MoveWaypointTile.prototype.popQueue = function() {
  return this.waypoint_queue[this.current_wp_index];
};

MoveWaypointTile.prototype.initQueue = function() {
  this.current_wp_index = 0;
  this.target_index = this.lastIndex();
  this.workQueue();
};

MoveWaypointTile.prototype.workQueue = function() {
  var next_target = this.popQueue();
  this.current_target_point = next_target;
  this.tick_fn = 'move';
};

MoveWaypointTile.prototype.lastIndex = function() {
  return this.waypoint_queue.length - 1;
};

MoveWaypointTile.prototype.workNextWaypoint = function() {
  this.tick_fn = 'idle';
  var current_wp_index = this.current_wp_index;
  var next_index = this.current_wp_index + 1;
  var prev_index = this.current_wp_index - 1;
  var last_index = this.lastIndex();
  var is_end = false;

  // Yoyo
  if (this.move_type === MoveWaypointTile.MoveType.Yoyo) {
    if (this.current_wp_index === this.target_index) {
      this.target_index = this.target_index === 0 ? last_index : 0;
    }
    // Moving forward in queue
    if (this.target_index > 0) {
      this.current_wp_index = Math.min(last_index, next_index);
    // Moving backwards in queue
    } else {
      this.current_wp_index = Math.max(0, prev_index);
    }
  }

  // Circular
  if (this.move_type === MoveWaypointTile.MoveType.Circular) {
    if (next_index <= last_index) {
      this.current_wp_index = next_index;
    } else {
      this.current_wp_index = 0;
      var first_wp = this.waypoint_queue[0];
      this.setTilePosition(this.init_cell.row, this.init_cell.col, true);
    }
  }

  // Loop
  if (this.move_type === MoveWaypointTile.MoveType.Loop) {
    if (next_index <= last_index) {
      this.current_wp_index = next_index;
    } else {
      this.current_wp_index = 0;
    }
  }

  // Once
  if (this.move_type === MoveWaypointTile.MoveType.Once) {
    if (next_index <= last_index) {
      this.current_wp_index = next_index;
    } else {
      is_end = true;
    }
  }

  if (!is_end) {
    var wp = this.waypoint_queue[this.current_wp_index];
    this.workQueue();
  }
};

MoveWaypointTile.prototype.updateTilePosition = function() {
  var current_sprite_pos = this.graphic.position;
  var current_sprite_x = current_sprite_pos.x;
  var current_sprite_y = current_sprite_pos.y;
  var x = this.position.x;
  var y = this.position.y;

  if (current_sprite_x > x + this.size.width - this.move_offset) {
    this.setTilePosition(this.row, this.col + 1);
  } else if (current_sprite_x < x - this.move_offset) {
    this.setTilePosition(this.row, this.col - 1);
  } else if (current_sprite_y < y - this.move_offset) {
    this.setTilePosition(this.row - 1, this.col);
  } else if (current_sprite_y > y + this.size.height - this.move_offset) {
    this.setTilePosition(this.row + 1, this.col);
  }
};

MoveWaypointTile.prototype.move = function() {
  this.updateTilePosition();
  var pos = this.graphic.position;
  var target = this.current_target_point;
  if (target) {
    var next_x = pos.x;
    var next_y = pos.y;
    var x_dir = pos.x > target.x ? -1 : 1;
    var y_dir = pos.y > target.y ? -1 : 1;
    var x_arrived = true;
    var y_arrived = true;
    if (pos.x !== target.x) {
      x_arrived = false;
      next_x += (this.vel.x * x_dir) | 0;
    }
    if (pos.y !== target.y) {
      y_arrived = false;
      next_y += (this.vel.y * y_dir) | 0;
    }
    if (x_arrived && y_arrived) {
      this.tick_fn = 'idle';
      var wait = parseInt(target.wait, 10) || 0
      this.queue.add('workNextWaypoint', wait);
    } else {
      this.graphic.setPosition(next_x, next_y);
    }
  }
};
