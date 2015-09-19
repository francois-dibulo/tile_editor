FiestamanApp.controllers.controller('GameCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {

  $scope.setCurrentActivator = function(from, data, player) {
    var type = data.params.activator_type + "Tile";
    type = type === "ActivatorBombTile" ? "BombTile" : type;
    var obj = GameHandler.getGameObjectDataByProperty('class_name', type);
    var file = "";
    if (obj && obj.sprites) {
      if (type === "BombTile") {
        file = 'bomb_000' + (player.assets_number - 1) + '_tick';
      } else {
        file = obj.sprites.idle.files ? obj.sprites.idle.files[0] : obj.sprites.idle.file;
      }
      var img_src = GameHandler.assets_base_path + file + ".png";
      player.current_type = img_src;
    } else {
      console.warn("Could not find game object by property class_name", type);
    }
    $scope.$apply();
  };

  $scope.init = function() {
    GameHandler.is_running = true;
    SfxManager.playRandomIngameSound();
    initGame();

    air_console.registerOnMessageHandler('ON_END', function(from, params, player) {
      SfxManager.stopAll();
      GameHandler.is_running = false;
      var overall_winners = GameHandler.getSessionWinners().winners;
      if (overall_winners.length) {
        $scope.setBackground();
        SfxManager.play('win_screen');
        $location.path('/session_end');
      } else {
        SfxManager.play('score_board');
        $location.path('/highscore');
      }
      $scope.$apply();
    });

    air_console.deRegisterOnMessageHandler('SET_CURRENT_ACTIVATOR');
    air_console.registerOnMessageHandler('SET_CURRENT_ACTIVATOR', function(from, data, player) {
      $scope.setCurrentActivator(from, data, player);
    });

    air_console.deRegisterOnMessageHandler('UPDATE_VIEW');
    air_console.registerOnMessageHandler('UPDATE_VIEW', function(from, data, player) {
      $scope.$apply();
    });

    air_console.deRegisterOnMessageHandler('TRACK_GR_BOMB');
    air_console.registerOnMessageHandler('TRACK_GR_BOMB', function(from, data, player) {
      // Disable tracking for now
      return;
      if (!from || !player) return;
      var params = {
        type: "gold_rush_bomb_explode",
        data: {
          assets_number: player.assets_number
        }
      };
      $http.post('/logs', params).success(function(data, status, headers, config) {});
    });
  };

  $scope.getSessionWinners = function() {
    return GameHandler.getSessionWinners().winners;
  };

  $scope.getSessionLoser = function() {
    return GameHandler.getSessionWinners().loser;
  };

  $scope.getBackImage = function(player) {
    return 'url(/assets/json/player_000' + (player.assets_number - 1) + '_walk_back.png)';
  };

}]);
