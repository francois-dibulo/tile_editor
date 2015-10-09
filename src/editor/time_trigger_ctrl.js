GameEditor.controllers.controller('TimeTriggerCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.done = $scope.$parent.doneTriggerSet;
  $scope.TimeTriggerType = GE.TimeTrigger.TriggerType;

  $scope.setTimeTriggerType = function(type) {
    var condition = $scope.$parent.getActiveCondition();
    condition.trigger_type = type;
    condition.labels.type = " - " + type;
    condition.trigger_at = [];
    $scope.addTriggerAt();
  };

  $scope.addTriggerAt = function() {
    var condition = $scope.$parent.getActiveCondition();
    var start_value = condition.trigger_type === $scope.TimeTriggerType.Exact ? [0] : [0, 0];
    condition.trigger_at = condition.trigger_at.concat(start_value);
  };

  $scope.removeTriggerAt = function(index) {
    var condition = $scope.$parent.getActiveCondition();
    if (condition.trigger_type === $scope.TimeTriggerType.Exact) {
      condition.trigger_at.splice(index, 1);
    } else {
      condition.trigger_at.splice(index, 2);
    }
  };

  $scope.updateTriggetAtValue = function(index, value) {
    console.log(index, value);
    var condition = $scope.$parent.getActiveCondition();
    condition.trigger_at[index] = value;
  };
}]);
