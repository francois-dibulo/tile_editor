var MoveTile = function(options) {
  options = options || {};
  MoveEntity.apply(this, arguments);
  this.type = 'MoveTile';
  // By Waypoints
  this.current_target_point = null;
  this.waypoint_queue = [];
  this.do_loop = false;
  this.vel = {
    x: 1,
    y: 1
  };
  //this.addSignal('moved');
};

MoveTile.MoveType = {
  Once: 'once',
  Yoyo: 'yoyo'
};

MoveTile.prototype = new MoveEntity();

MoveTile.prototype.addWaypoint = function(point) {
  this.waypoint_queue.unshift(point);
};

MoveTile.prototype.clearWaypoints = function() {
  this.waypoint_queue = [];
};

MoveTile.prototype.popQueue = function() {
  var point = null;
  if (this.waypoint_queue.length >= 1) {
    point = this.waypoint_queue.pop();
  }
  return point;
};

MoveTile.prototype._show = function() {
  this.addWaypoint({ x: 40, y: 0 });
  this.addWaypoint({ x: 80, y: 0 });
  this.addWaypoint({ x: 80, y: 40 });
  this.workQueue();
};

MoveTile.prototype.workQueue = function() {
  this.current_target_point = this.popQueue();
};

MoveTile.prototype.move = function() {
  var pos = this.position;
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
      this.workQueue();
    } else {
      this.setPosition(next_x, next_y);
    }
  }
};
