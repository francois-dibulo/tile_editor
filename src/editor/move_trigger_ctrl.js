GameEditor.controllers.controller('MoveTriggerCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.done = $scope.$parent.doneTriggerSet;
  $scope.show_info_select_object = false;
  $scope.MoveType = MoveWaypointTile.MoveType;
  $scope.move_functions = ['jumpTo', 'waypoints'];
  $scope.move_types = MoveWaypointTile.MoveType;

  $scope.selectOtherObject = function(fn) {
    $scope.show_info_select_object = true;
    $scope.$parent.selectOtherObject($scope, fn);
  };

  $scope.selectCell = function(fn) {
    $scope.show_info_select_cell = true;
    $scope.$parent.selectCellOnMap($scope, fn);
  };

  $scope.setJumpToCell = function(cell, point, from_selection) {
    $scope.show_info_select_cell = false;
    var action = $scope.$parent.getActiveAction();
    action.target_cell = {
      row: cell.row,
      col: cell.col,
      x: point.x,
      y: point.y
    };
    action.labels.to_cell = " cell [" + cell.col + "," + cell.row + "]";
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

  $scope.setMoveFunction = function(fn) {
    var action = $scope.$parent.getActiveAction();
    action.move_function = fn;
    action.labels.move_function = ' by ' + fn;
    if (fn === 'waypoints') {
      action.waypoint_queue = [];
    }
  };

  $scope.setWaypointType = function(type) {
    var action = $scope.$parent.getActiveAction();
    action.wp_move_type = type;
  };

  $scope.setWpTool = function(fn) {
    $scope.$parent.selectWaypointProxy($scope, fn);
  };

  $scope.addWaypoint = function(point, cb) {
    var action = $scope.$parent.getActiveAction();
    if (action.waypoint_queue.length === 0) {
      action.waypoint_queue.push({
        x: action.action_object.position.x,
        y: action.action_object.position.y,
        wait: 0
      });
    }
    point.wait = 0;
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
