FiestamanApp.controllers.controller('LogCtrl', ['$scope', '$location', '$http', '$timeout', function ($scope, $location, $http, $timeout) {

  function toggleFullScreen() {
    if (!document.fullscreenElement &&    // alternative standard method
        !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  var loadLevels = function (cb) {
    var current_mode = GameHandler.getCurrentMode().key;
    var players_len = GameHandler.getPlayers().length;
    $http.get('/levels?mode=' + current_mode + "&rand_num=true&player_len=" + players_len).success(function(response) {
      GameHandler.setLevels(response);
      cb();
    });
  };

  $scope.ac_pos = 0;
  $scope.count_gb = 0;
  $scope.quantity = 4;
  $scope.gr_data = [];

  var animateGoldBrick = function() {
    var step = 66;
    var max_step = step * 3;
    var new_pos = $scope.ac_pos > max_step ? 0 : $scope.ac_pos + step;
    $scope.ac_pos = new_pos;
    $timeout(function() {
      animateGoldBrick();
    }, 220);
  }

  $scope.loadGoldRushData = function() {
    var type = 'gold_rush_bomb_explode';
    $http.get('/logs?type=' + type).success(function(response) {
      $scope.count_gb = response.length;
      $scope.gr_data = response;
    });
  };

  $scope.pullGRData = function() {
    $timeout(function() {
      $scope.loadGoldRushData();
      $scope.pullGRData();
    }, 3000);
  };

  $scope.getAcPos = function() {
    return ($scope.ac_pos * -1) + 'px 0';
  };

  $scope.init = function() {
    animateGoldBrick();
    $scope.pullGRData();
  };

  $scope.toggleFullScreen = function() {
    toggleFullScreen();
  };

}]);
