GameEditor.controllers.controller('StateActionCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.done = $scope.$parent.doneTriggerSet;
  $scope.selectOtherObject = $scope.$parent.selectOtherObject;
  $scope.action_functions = ['hide', 'show', 'remove', 'create', 'setInactive'];
  $scope.entity_events = GE.Entity.Event;

  $scope.addEvent = function(evt) {
    var condition = $scope.$parent.getActiveCondition();
    condition.evt = evt;
    condition.labels.evt = ' triggers ' + evt;
  };

  // IF
  $scope.setTriggerObject = function(entity) {
    var condition = $scope.$parent.getActiveCondition();
    if (!entity) {
      //
      condition.labels.listener_object = ' of other object';
    } else {
      condition.listener_object = entity;
      condition.labels.listener_object = ' of this object';
    }
  };

  // THEN
  // action_object is the object whos action function will be triggered
  $scope.setActionObject = function(entity) {
    var action = $scope.$parent.getActiveAction();
    if (!entity) {
      //
      action.labels.action_object = ' of other object';
    } else {
      action.action_object = entity;
      action.labels.action_object = ' of this object';
    }
  };

  $scope.addActionFunction = function(fn) {
    var action = $scope.$parent.getActiveAction();
    action.action_fns = [fn];
    action.labels.action_fns = ' to ' + fn;
  };

  $scope.isFunctionSelected = function(fn) {
    var action = $scope.$parent.getActiveAction();
    if (!action || !action.action_fns) return false;
    return action.action_fns.indexOf(fn) > -1;
  };
}]);
