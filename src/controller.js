var air_console = null;
var current_player = null;
var BASE_PATH = 'assets/json/';

var setPlayerName = function(name) {
  name = name || 'Player ' +  current_player.number;
  if (current_player && current_player.number) {
    $('.player_name').html(name);
  }
};

var setCurrentPlayer = function(player) {
  if (!player) throw "Param player missing in setCurrentPlayer";
  current_player = player;
  setPlayerName();

  $('body').css({
    'background-color': current_player.color
  });

  $('.player_avatar').css({
    backgroundImage: 'url(' + BASE_PATH + 'player_000' + (current_player.assets_number - 1) + '_idle_front.png)',
  });

  $('.player_body_win').css({
    'background-image': 'url(/assets/screen/body_profile_player_00' + (player.assets_number - 1) + '_win.png)'
  });

  $('.player_body_lose').css({
    'background-image': 'url(/assets/screen/body_profile_player_00' + (player.assets_number - 1) + '_dead.png)'
  });

  $('.start_intro_character').css({
    'background-image': 'url(assets/controller/character_info_00' + (player.assets_number - 1) + '.png)'
  });

  $('.player_character_name').html(player.character_name);
};

function init() {
  air_console = new AirConsole({"orientation": "landscape"});
  Controls.init();

  air_console.onMessage = function(from, data) {

    if (from == AirConsole.SCREEN) {
      if (data.vibrate) {
        Controls.vibrate(data.vibrate);
      }

      if (data.player) {
        setCurrentPlayer(data.player);
      }

      if (data.show_view) {
        ViewManager.show(data.show_view);
        Controls.reset();
        if (data.show_view === 'game_container') {
          Controls.reinitActivator();
        }
      }

      if (data.activators) {
        Controls.setActivatorMap(data.activators);
      }

      if (data.do_reconnect) {
        Controls.sendOnPlayerReady();
      }

      if (typeof data.is_flame_man !== 'undefined') {
        if (data.is_flame_man === true) {
          setPlayerName('FlameMan');
        } else {
          setPlayerName();
        }
      }
    }

  };

  air_console.onReady = function(code, device_id) {
    Controls.sendOnPlayerReady();
  };

  // Ping after some seconds if the connect view is still shown
  setTimeout(function() {
    if (ViewManager.current_view_id === 'connect_container') {
      Controls.reconnect();
    }
  }, 4000);

}

window.onload = init;
