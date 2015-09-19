GameEditor.controllers.controller('EditorCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.level_data = {};
  $scope.cells = [];

  $scope.tile_size = 40;
  $scope.num_rows = 12;
  $scope.num_cols = 20;
  $scope.width = $scope.tile_size * $scope.num_cols;
  $scope.height = $scope.tile_size * $scope.num_rows;
  $scope.canvas_ele = null;

  var scaleCanvas = function() {
    var level_overflow_container = document.getElementById('level_overflow_container');
    var level_container = document.getElementById('level_container');

    var max_width = level_overflow_container.clientWidth;
    var max_height = window.innerHeight;

    var width = level_container.clientWidth;
    var height = level_container.clientHeight;

    var scale = Math.min(max_width / width, max_height / height, 1);
    var new_height = Math.min(scale * height, max_height);
    var new_width = Math.min(scale * width, max_width);
    level_container.style.webkitTransform = "scale(" + scale + ", " + scale + ")";
    level_container.style.transform = "scale(" + scale + ", " + scale + ")";
  };

  $scope.onLevelMousedown = function() {
    $scope.is_drawing = true;
  };

  $scope.onLevelMouseup = function() {
    $scope.is_drawing = false;
  };

  $scope.onCellMouseenter = function(row_index, col_index) {
  };

  $scope.init = function() {
    $scope.canvas_ele = angular.element(document.getElementById('canvas'));
    console.log($scope.canvas_ele, document.getElementById('canvas'))
  };

}]);
