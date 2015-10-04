GameEditor.controllers.controller('CollisionTriggerCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.done = $scope.$parent.doneTriggerSet;
  $scope.selectOtherObject = function(fn) {
    $scope.show_info_select_object = true;
    $scope.$parent.selectOtherObject($scope, fn);
  };
  $scope.is_entity_type = false;
  $scope.show_info_select_object = false;

  // IF
  $scope.setObject1 = function(entity, from_selection) {
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
