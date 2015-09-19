/**
 * Sets up the communication between screen and game pads.
 */
var air_console = new AirConsole();
air_console.on_message_handlers = {};

air_console.onMessage = function(from, data) {
  var player = GameHandler.getPlayerByDeviceId(from);
  this.triggerMessageHandler(from, data, player);
};

air_console.triggerMessageHandler = function(from, data, player) {
  var handler = this.on_message_handlers[data.key];
  if (handler) {
    for (var i = 0; i < handler.length; i++) {
      var fn = handler[i].callback;
      fn(from, data, player);
    }
  }
};

air_console.registerOnMessageHandler = function(key, callback) {
  if (this.on_message_handlers[key] &&
      this.on_message_handlers[key].indexOf(callback) > -1) {
    return;
  }

  if (!this.on_message_handlers[key]) {
    this.on_message_handlers[key] = [];
  }

  this.on_message_handlers[key].push({
    key: key,
    callback: callback
  });
};

air_console.deRegisterOnMessageHandler = function(key) {
  this.on_message_handlers[key] = [];
};

air_console.onDeviceStateChange = function(device_id, device_data) {
  if (device_data == undefined) {
    this.onDeviceLeft(device_id);
  }
};

air_console.onDeviceJoin = function(device_id) {
  var self = this;
  if (!GameHandler.playersCanJoin()) {
    this.message(device_id, {
      show_view: 'max_players_container'
    });
  } else {
    var player = GameHandler.addPlayer(device_id);
    if (player) {
      setTimeout(function() {
        GameHandler.togglePlayerReadyState(player, true);
        var ids = [{device_id: device_id}];
        var view = GameHandler.is_running ? 'already_running_container' : 'intro_container';
        self.message(device_id, {
          show_view: view,
          player: {
            device_id: device_id,
            color: player.color,
            is_ready: player.is_ready,
            score: player.score,
            number: player.number,
            assets_number: player.assets_number,
            character_name: player.character_name
          },
          color: player.color
        });
        if (GameHandler.is_running) {
          GameHandler.setPlayerState(GameHandler.PLAYER_STATES.DEAD, player);
        }
      }, 2000);
    } else {
      console.info("Player already exists", player);
    }
  }
};

air_console.onDeviceLeft = function(device_id) {
  this.onMessage(device_id, {
    key: 'ON_DEVICE_LEFT'
  });
};

air_console.onReady = function(code, device_id) {
  // Case if Screen loads later than controllers, tell them to reconnect
  if (this.devices.length && !GameHandler.getPlayers().length) {
    this.broadcast({
      do_reconnect: true
    });
  }
};

air_console.onForceConnect = function(device_id) {
  var player = GameHandler.getPlayerByDeviceId(device_id);
  if (!player) {
    console.error("Can not force connect - player does not exist", device_id);
  } else {
    this.showControllerView('intro_container', [{device_id: device_id}]);
  }
};

air_console.broadcastCtrls = function(data, devices) {
  if (!data) throw 'No data to broadcast';
  devices = devices || GameHandler.getPlayers();
  for (var i = 0; i < devices.length; i++) {
    console.log("broadcast", devices[i].device_id, data);
    this.message(devices[i].device_id, data);
  }
};

air_console.showControllerView = function(view, device_ids) {
  if (!view) return;
  this.broadcastCtrls({ show_view: view }, device_ids);
};

// -----------------------
// Register Events
// -----------------------
var isReadyToStart = function() {
  var players_len = GameHandler.getPlayers().length;
  var has_min_players = players_len >= GameHandler.min_players;
  var all_ready = GameHandler.allPlayersReady();
  return has_min_players && all_ready;
};

var setReadyState = function(player, state) {
  GameHandler.togglePlayerReadyState(player, state);
  var is_ready = player.is_ready;
  if (is_ready && isReadyToStart()) {
    air_console.showControllerView("start_container");
  } else {
    var broadcast_id = [{device_id: player.device_id }];
    var view = is_ready ? 'get_not_ready_container' : 'get_ready_container';
    air_console.showControllerView(view, broadcast_id);
  }
};

var startGame = function() {
  air_console.showControllerView('loading_game_container');
};

air_console.registerOnMessageHandler('START', function(from, params, player) {
  startGame();
});

air_console.registerOnMessageHandler('RESTART', function(from, params, player) {
  startGame();
});

air_console.registerOnMessageHandler('NEXT_LEVEL', function(from, params, player) {
  GameHandler.setNextLevel();
  startGame();
  air_console.onMessage(from, { key: 'ON_NEXT_LEVEL' });
});

air_console.registerOnMessageHandler('ON_END', function(from, params, player) {
  var sessions_players = GameHandler.getSessionWinners();
  var winners = sessions_players.winners;
  if (winners.length) {
    air_console.showControllerView('sessions_end_win_container', winners);
    air_console.showControllerView('sessions_end_lose_container',sessions_players.loser);
  } else {
    air_console.showControllerView('end_container');
  }
});

air_console.registerOnMessageHandler('ON_LEAVE_GAME', function(from, params, player) {
  air_console.showControllerView('player_left_container', [{ device_id: player.device_id }]);
});

air_console.registerOnMessageHandler('MAIN_MENU', function(from, params, player) {
  air_console.showControllerView('start_container');
});

air_console.registerOnMessageHandler('MODE_NEXT', function(from, data, player) {
  GameHandler.selectNextMode();
});

air_console.registerOnMessageHandler('MODE_PREV', function(from, data, player) {
  GameHandler.selectPrevMode();
});

air_console.registerOnMessageHandler('ON_PLAYER_DEAD', function(from, data, player) {
  air_console.showControllerView('player_dead_container', [{ device_id: player.device_id }]);
});

air_console.registerOnMessageHandler('ON_FORCE_CONNECT', function(from, data, player) {
  air_console.onForceConnect(from);
});

air_console.registerOnMessageHandler('ON_PLAYER_READY', function(from, data, player) {
  air_console.onDeviceJoin(from);
});
