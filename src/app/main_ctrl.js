FiestamanApp.controllers.controller('MainCtrl', ['$scope', '$location', '$http', function ($scope, $location, $http) {
  $scope.game_handler = null;
  $scope.players = [];
  $scope.modes = [];
  $scope.current_mode = null;
  var intro_sound_timeout = null;
  var url_params = {};

  var getQuery = function () {
    var query = document.location.search;
    var args = query.substring(1).split('&');
    var argsParsed = {};
    for (i=0; i < args.length; i++) {
      var arg = decodeURIComponent(args[i]);
      if (arg.indexOf('=') == -1) {
        argsParsed[arg.trim()] = true;
      } else {
        var kvp = arg.split('=');
        argsParsed[kvp[0].trim()] = kvp[1].trim();
      }
    }
    return argsParsed;
  };
  url_params = getQuery();

  $scope.STATES = {
    LOADING: 'loading',
    WAITING_MORE_PLAYERS: 'waiting_more_players',
    START_GAME: 'start_game'
  };
  $scope.current_state = $scope.STATES.LOADING;

  var startGame = function() {
    stopIntroSound();
    $scope.setBackground('/assets/screen/backstage_wall.png');
    $location.path('/game');
  };

  var playIntroSound = function() {
    stopIntroSound();
    intro_sound_timeout = setTimeout(function() {
      SfxManager.play('start_screen');
    }, 2000);
  };

  var stopIntroSound = function() {
    clearTimeout(intro_sound_timeout);
    SfxManager.stopAll();
  };

  var loadLevels = function (cb) {
    var level_id = url_params.level_id;
    if (level_id) {
      $http.get('/levels?level_id=' + level_id).success(function(response) {
        if (!response) {
          throw "No level found with id: " + level_id;
        } else {
          if (url_params.mode) {
            GameHandler.setMode(url_params.mode);
          }
          GameHandler.setLevels(response);
          cb();
        }
      });
    } else {
      var current_mode = GameHandler.getCurrentMode().key;
      var players_len = GameHandler.getPlayers().length;
      $http.get('/levels?mode=' + current_mode + "&rand_num=true&player_len=" + players_len).success(function(response) {
        if (!response || !response.length) {
          throw "No levels found for mode: " + current_mode + " and players_len: " + players_len;
        } else {
          GameHandler.setLevels(response);
          cb();
        }
      });
    }
  };

  $scope.setBackground = function(file) {
    if (file) {
      document.body.style.backgroundImage = 'url(' + file + ')';
    } else {
      document.body.style.backgroundImage = "none";
    }
  };

  $scope.init = function() {
    $scope.game_handler = GameHandler;
    GameHandler.view_scope = $scope;
    $scope.modes = $scope.game_handler.modes;
    $scope.current_mode = $scope.modes[$scope.game_handler.selected_mode_index];
    $scope.players = $scope.game_handler.players;

    air_console.registerOnMessageHandler('START', function(from, params, player) {
      loadLevels(function () {
        startGame();
      });
    });

    air_console.registerOnMessageHandler('ON_NEXT_LEVEL', function(from, params, player) {
      startGame();
      $scope.$apply();
    });

    air_console.registerOnMessageHandler('RESTART', function(from, params, player) {
      startGame();
      $scope.$apply();
    });

    air_console.registerOnMessageHandler('MAIN_MENU', function(from, params, player) {
      $scope.setBackground();
      GameHandler.reset();
      $location.path('/main');
      playIntroSound();
      $scope.$apply();
    });

    air_console.registerOnMessageHandler('ON_DEVICE_LEFT', function(from, params, player) {
      GameHandler.removePlayer(player.device_id);
    });

    playIntroSound();
  };

  $scope.update = function() {
    $scope.current_mode = $scope.modes[$scope.game_handler.selected_mode_index];
    $scope.players = GameHandler.getPlayers();
    $scope.checkMinPlayers();
    $scope.$apply();
  };

  $scope.checkMinPlayers = function() {
    var players_len = GameHandler.getPlayers().length;
    var has_min_players = players_len >= GameHandler.min_players;

    if (players_len > 0 && url_params.level_id) {
      setTimeout(function() {
        loadLevels(function () {
          startGame();
        });
      }, 3000);
    }

    // All players ready - Start game
    if (has_min_players) {
      $scope.current_state = $scope.STATES.START_GAME;
    // Min players not reached
    } else if (!has_min_players) {
      $scope.current_state = $scope.STATES.WAITING_MORE_PLAYERS;
    // No players in the game
    } else if (players_len === 0) {
      $scope.current_state = $scope.STATES.WAITING_MORE_PLAYERS;
    }
  };

  $scope.getAvatarPosition = function(number) {
    var player_list_width = 121;
    return (((number - 1) * player_list_width) * -1) + 'px';
  };

  $scope.getCharacterImage = function(player, prefix_file) {
    var prefix_file = prefix_file || 'face_profile_player_framed_00';
    var STATE = GameHandler.PLAYER_STATES;
    var img_state = STATE.ALIVE;

    if (player.state === STATE.DEAD) {
      img_state = STATE.DEAD;
    } else if (player.state === STATE.WIN) {
      img_state = STATE.WIN;
    }

    return prefix_file + (player.assets_number - 1) + '_' + img_state + '.png';
  };

  $scope.getTrophiesCount = function(trophies_count) {
    return new Array(trophies_count);
  };

  $scope.getMaxTrophies = function() {
    return new Array(GameHandler.trophies_in_session);
  };

  $scope.toggleMuteSound = function() {
    SfxManager.toggleMute();
  };

}]);
