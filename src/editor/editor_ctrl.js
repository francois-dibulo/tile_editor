GameEditor.controllers.controller('EditorCtrl', ['$scope', '$http', function ($scope, $http) {
  $scope.level_data = {};
  $scope.game_objects = [];
  $scope.cells = [];
  //
  $scope.tile_size = 40;
  $scope.rows = 12;
  $scope.cols = 20;
  $scope.width = $scope.tile_size * $scope.cols;
  $scope.height = $scope.tile_size * $scope.rows;
  $scope.canvas_ele = null;
  //
  $scope.Tool = {
    Paint: 'paint',
    Delete: 'delete',
    Inspect: 'inspect',
    SetWaypoint: 'set_waypoint'
  };
  $scope.current_tool = $scope.Tool.Paint;
  $scope.current_selected_entity = null;
  $scope.current_inspect_cell = null;
  $scope.current_inspect_entity = null;
  //
  var game = null;
  var grid = null;

  $scope.togglePlay = function() {
    if (!game.is_running) {
      game.start();
    } else {
      game.stop();
    }
  };

  $scope.setTool = function(tool) {
    if (tool === $scope.Tool.Paint || tool === $scope.Tool.Remove) {
      $scope.current_inspect_cell = null;
      $scope.current_inspect_entity = null;
    }
    $scope.current_tool = tool;
  };

  $scope.setWorldSize = function(rows, cols) {
    $scope.rows = parseInt(rows, 10);
    $scope.cols = parseInt(cols, 10);
    $scope.width = $scope.tile_size * $scope.cols;
    $scope.height = $scope.tile_size * $scope.rows;
    game.world.engine.renderer.resize($scope.width, $scope.height);
  };

  var initGameObjects = function() {
    var objects = [
      {
        class_name: 'WallTile',
        opts: {
          shape_data: {
            type: Graphic.Type.Rect,
            fill_color: 0x34495e
          }
        },
        is_unique: true
      },
      {
        class_name: 'FloorTile',
        opts: {
          shape_data: {
            type: Graphic.Type.Rect,
            fill_color: 0xecf0f1
          }
        },
        is_unique: true
      },
      {
        class_name: 'SpawnTile',
        opts: {
          shape_data: {
            type: Graphic.Type.Rect,
            fill_color: 0x16a085
          }
        },
        is_unique: true
      },
      {
        class_name: 'EndTile',
        is_unique: true,
        opts: {
          shape_data: {
            type: Graphic.Type.Rect,
            fill_color: 0x2ecc71
          }
        }
      },
      {
        class_name: 'MoveWaypointTile',
        opts: {
          shape_data: {
            type: Graphic.Type.Rect,
            fill_color: 0xe74c3c
          }
        },
        tools: {
          set_waypoint: true
        }
      }
    ];
    $scope.game_objects = objects;
  };

  var buildGrid = function() {
    grid.clear();
    grid.createLines($scope.rows, $scope.cols, $scope.tile_size);
    game.world.render();

    $scope.cells = [];
    for (var c = 0; c < $scope.cols; c++) {
      $scope.cells[c] = [];
      for (var r = 0; r < $scope.rows; r++) {
        $scope.cells[c][r] = [];
      }
    }
    game.prebuildCells($scope.cols, $scope.rows);
  };

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

  var getPointOnCanvas = function(e) {
    var c = game.world.engine.getRenderView().getBoundingClientRect();
    var x = e.pageX - c.left;
    var y = e.pageY - c.top;
    return {
      x: x,
      y: y
    };
  };

  var pointToCell = function(point) {
    return {
      col: (Math.floor(point.x / $scope.tile_size)),
      row: (Math.floor(point.y / $scope.tile_size))
    };
  };

  var cellHasTile = function(col, row, type) {
    var entities = $scope.cells[col][row];
    var has = false;
    for (var i = 0; i < entities.length; i++) {
      if (entities[i].class_name === type) {
        has = true;
        break;
      }
    }
    return has;
  };

  var clearCell = function(col, row) {
    game.loopEntities(function(entity) {
      if (entity.row === row && entity.col == col) {
        entity.remove();
      }
    });
    game.updateEntityHandlers();
    $scope.cells[col][row] = [];
    game.world.render();
  };

  var addEntityToCells = function(entity) {
    var col = entity.col;
    var row = entity.row;
    $scope.cells[col][row].push(entity);
  };

  var getNormPoint = function(point) {
    var cell = pointToCell(point);
    return {
      x: cell.col * $scope.tile_size,
      y: cell.row * $scope.tile_size
    };
  };

  $scope.selectEntity = function(entity) {
    if ($scope.current_tool === $scope.Tool.Paint) {
      $scope.current_selected_entity = entity;
    } else if ($scope.current_tool === $scope.Tool.Inspect) {
      $scope.current_inspect_entity = entity;
    }
  };

  $scope.createEntity = function(point) {
    var obj = $scope.current_selected_entity;
    if (!obj) return;
    var cell = pointToCell(point);
    var class_name = obj.class_name;
    var col = cell.col;
    var row = cell.row;
    var x = cell.col * $scope.tile_size;
    var y = cell.row * $scope.tile_size;
    var cell_entities = $scope.cells[col][row];
    // Entity that are unique can not be multiple times on a cell
    if (obj.is_unique && cellHasTile(col, row, class_name)) {
      return;
    }
    // Remove all cell entities if that entity is unique
    if (obj.is_unique && cell_entities.length) {
      clearCell(col, row);
    }
    //
    obj.opts.position = {
      x: x,
      y: y
    };
    obj.opts.width = $scope.tile_size;
    obj.opts.height = $scope.tile_size;
    obj.opts.row = row;
    obj.opts.col = col;
    //
    var entity = new window[obj.class_name](obj.opts);
    entity.createSprite();

    // Trigger on-remove-event
    var move_signal = entity.getSignal('moved');
    if (move_signal) {
      move_signal.add(function() {
        game.swapTile(entity);
      }, this);
    }
    game.addEntity(entity);
    if (!game.is_running) {
      game.world.render();
    } else {
      entity.ready();
    }
    addEntityToCells(entity);
  };

  $scope.onCanvasMousedown = function(e) {
    if ($scope.is_drawing) return;
    var point = getPointOnCanvas(e);
    if ($scope.current_tool === $scope.Tool.Paint) {
      $scope.is_drawing = true;
      $scope.createEntity(point);
    } else if ($scope.current_tool === $scope.Tool.Delete) {
      var cell = pointToCell(point);
      clearCell(cell.col, cell.row);
    } else if ($scope.current_tool === $scope.Tool.Inspect) {
      $scope.current_inspect_entity = null;
      var cell = pointToCell(point);
      $scope.current_inspect_cell = $scope.cells[cell.col][cell.row];
    } else if ($scope.current_tool === $scope.Tool.SetWaypoint) {
      var norm_point = getNormPoint(point);
      $scope.current_inspect_entity.addWaypoint(norm_point);
    }
  };

  $scope.onCanvasMouseup = function() {
    $scope.is_drawing = false;
  };

  $scope.onCanvasMouseenter = function(e) {
  };

  $scope.changeSize = function(rows, cols) {
    $scope.setWorldSize(rows, cols);
    setTimeout(function() {
      buildGrid();
    }, 1000);
  };

  $scope.changeTileSize = function(size) {
    $scope.tile_size = size;
    $scope.setWorldSize($scope.rows, $scope.cols);
    buildGrid();
  };

  $scope.init = function() {
    $scope.canvas_ele = angular.element(document.getElementById('canvas'));
    //
    var world = new World('canvas_container', $scope.width, $scope.height);
    game = new TileGame(world);

    grid = new Grid($scope.cols, $scope.rows, $scope.tile_size);
    world.addContainer(grid.getContainer());
    buildGrid();
    world.render();

    initGameObjects();
  };

}]);
