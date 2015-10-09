GameEditor.controllers.controller('CollisionTriggerCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.done = $scope.$parent.doneTriggerSet;
  $scope.show_info_select_object = false;
  $scope.show_info_select_cell = false;
  $scope.is_entity_type = false;

  $scope.selectOtherObject = function(fn) {
    $scope.show_info_select_object = true;
    $scope.$parent.selectOtherObject($scope, fn);
  };

  $scope.selectCell = function(fn) {
    var condition = $scope.$parent.getActiveCondition();
    condition.labels.with_cell = " with cell ";
    $scope.show_info_select_cell = true;
    $scope.is_entity_type = false;
    $scope.$parent.selectCellOnMap($scope, fn);
  };

  $scope.setCollisionCell = function(cell, point, from_selection) {
    $scope.show_info_select_cell = false;
    var condition = $scope.$parent.getActiveCondition();
    condition.collision_cell = {
      row: cell.row,
      col: cell.col,
      x: point.x,
      y: point.y
    };
    condition.labels.with_coords = " [" + cell.col + "," + cell.row + "]";
  };

  // IF
  $scope.setObject1 = function(entity, from_selection) {
    $scope.is_entity_type = false;
    $scope.show_info_select_object = false;
    var condition = $scope.$parent.getActiveCondition();
    if (from_selection) {
      condition.object_1 = entity;
      condition.labels.object_1 = ' other object';
    } else {
      condition.object_1 = entity;
      condition.labels.object_1 = ' this object';
    }
  };

  $scope.setObject2 = function(entity) {
    $scope.show_info_select_object = false;
    var condition = $scope.$parent.getActiveCondition();
    $scope.is_entity_type = false;
    condition.object_2 = entity;
    condition.labels.object_2 = ' with other object';
  };

  $scope.setObject2Type = function() {
    var condition = $scope.$parent.getActiveCondition();
    $scope.is_entity_type = true;
    condition.labels.object_2 = ' with object type';
  };

  $scope.setEntityType = function(type) {
    var condition = $scope.$parent.getActiveCondition();
    condition.entity_type = type;
    condition.labels.object_2 = ' with type ' + type;
  };

}]);
