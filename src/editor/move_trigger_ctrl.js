GameEditor.controllers.controller('MoveTriggerCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.done = $scope.$parent.doneTriggerSet;
  $scope.show_info_select_object = false;
  $scope.MoveType = MoveWaypointTile.MoveType;
  $scope.move_types = MoveWaypointTile.MoveType;

  /*
    action = {
      action_object: null,
      move_function: waypoints | jumpTo,
      waypoint_queue: [],
      wp_move_type: MoveWaypointTile.MoveType
    }
  */

  $scope.selectOtherObject = function(fn) {
    $scope.show_info_select_object = true;
    $scope.$parent.selectOtherObject($scope, fn);
  };

  $scope.setActionObject = function(entity, from_selection) {
    $scope.show_info_select_object = false;
    var action = $scope.$parent.getActiveAction();
    if (from_selection) {
      action.labels.action_object = ' other object';
    } else {
      action.labels.action_object = ' this object';
    }
    action.action_object = entity;
  };

  $scope.setWaypointType = function(type) {
    var action = $scope.$parent.getActiveAction();
    action.wp_move_type = $scope.move_types[type];
    action.waypoint_queue = [];
    $scope.$parent.renderWaypoints([]);
  };

  $scope.setWpTool = function(fn) {
    $scope.$parent.selectWaypointProxy($scope, fn);
  };

  $scope.addWaypoint = function(point, cell, cb) {
    var action = $scope.$parent.getActiveAction();
    if (action.waypoint_queue.length === 0 &&
        action.wp_move_type !== $scope.move_types.JumpTo) {
      action.waypoint_queue.push({
        x: action.action_object.position.x,
        y: action.action_object.position.y,
        wait: 0,
        row: action.action_object.row,
        col: action.action_object.col
      });
    }
    point.wait = 0;
    point.col = cell.col;
    point.row = cell.row;
    action.waypoint_queue.push(point);
    if (cb) {
      cb(action.waypoint_queue);
    }
  };

  $scope.removeWaypoint = function(index) {
    var action = $scope.$parent.getActiveAction();
    action.waypoint_queue.splice(index, 1);
    $scope.$parent.renderWaypoints(action.waypoint_queue);
  };

  $scope.copyWaypoints = function(object) {
    if (!object.waypoint_queue) return;
    var copy_wps = _.clone(object.waypoint_queue, true);
    $scope.current_inspect_entity.waypoint_queue = copy_wps;
    var e = $scope.current_inspect_entity;
    $scope.current_inspect_entity.waypoint_queue.unshift({
      x: e.position.x,
      y: e.position.y,
      wait: copy_wps[0].wait
    });
    $scope.current_inspect_entity.move_type = object.move_type;
    renderWaypoints($scope.current_inspect_entity);
  };

  $scope.resetWaypoints = function(entity) {
    var action = $scope.$parent.getActiveAction();
    action.waypoint_queue = [];
    $scope.$parent.renderWaypoints(action.waypoint_queue);
  };

}]);
