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
    SetWaypoint: 'set_waypoint',
    SelectOtherObject: 'select_other_object',
    SelectCell: 'select_cell'
  };
  $scope.current_tool = $scope.Tool.Paint;
  $scope.current_selected_entity = null;
  $scope.current_inspect_cell = null;
  $scope.current_inspect_entity = null;
  $scope.after_select_object_fn = null;
  //
  $scope.onTriggerEvents = GE.Entity.Event;
  //
  var game = null;
  var render_layer_0 = null;
  var render_layer_floor = null;
  var render_layer_1 = null;
  var render_layer_top = null;
  var grid = null;

  //
  var render = function() {
    game.render_engine.render();
  };

  var clearTopLayer = function() {
    render_layer_top.clear();
    render();
  };

  $scope.togglePlay = function() {
    if (!game.is_running) {
      grid.hide();
      game.start();
    } else {
      grid.show();
      game.stop();
      render();
    }
  };

  $scope.setTool = function(tool) {
    if (tool === $scope.Tool.Paint || tool === $scope.Tool.Delete) {
      $scope.current_inspect_cell = null;
      if ($scope.current_inspect_entity) {
        $scope.current_inspect_entity.active_trigger = null;
        $scope.current_inspect_entity = null;
      }
      clearTopLayer();
    }
    $scope.current_tool = tool;
  };

  $scope.setWorldSize = function(rows, cols) {
    $scope.rows = parseInt(rows, 10);
    $scope.cols = parseInt(cols, 10);
    $scope.width = $scope.tile_size * $scope.cols;
    $scope.height = $scope.tile_size * $scope.rows;
    game.render_engine.resize($scope.width, $scope.height);
  };

  var initGameObjects = function() {
    var objects = [
      {
        class_name: 'WallTile',
        opts: {
          graphics: [{
            type: GE.PixiGraphic.Type.Rectangle,
            fill_color: 0x34495e
          }]
        }
      },
      {
        class_name: 'FloorTile',
        opts: {
          graphics: [{
            type: GE.PixiGraphic.Type.Rectangle,
            fill_color: 0xecf0f1
          }]
        },
        is_unique: true
      },
      {
        class_name: 'SpawnTile',
        opts: {
          graphics: [{
            type: GE.PixiGraphic.Type.Rectangle,
            fill_color: 0x16a085
          }]
        },
        is_unique: true
      },
      {
        class_name: 'EndTile',
        is_unique: true,
        opts: {
          graphics: [{
            type: GE.PixiGraphic.Type.Rectangle,
            fill_color: 0x2ecc71
          }]
        }
      },
      {
        class_name: 'EnemyTile',
        opts: {
          graphics: [{
            type: GE.PixiGraphic.Type.Rectangle,
            fill_color: 0xe74c3c
          }]
        },
        tools: {
          set_waypoint: true
        }
      }
    ];
    $scope.game_objects = objects;
  };

  $scope.resetEntities = function() {
    if (game.is_running) {
      grid.show();
      game.stop();
    }
    game.loopEntities(function(entity) {
      entity.reset();
    });
    render();
  };

  var buildGrid = function() {
    grid.clear();
    grid.createLines($scope.rows, $scope.cols, $scope.tile_size);
    render();

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
    var c = game.render_engine.container_ele.getBoundingClientRect();
    var x = e.pageX - c.left;
    var y = e.pageY - c.top - window.scrollY;
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
      if (entity && entity.row === row && entity.col == col) {
        entity.remove();
      }
    });
    $scope.cells[col][row] = [];
    render();
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

  var renderWaypoints = function(waypoints) {
    clearTopLayer();
    if (!waypoints || !waypoints.length) { return; };
    var w = $scope.tile_size / 2;
    var h = $scope.tile_size / 2;
    var graphic = new PIXI.Graphics();
    graphic.lineStyle(1, 0x00FF00, 1);
    for (var i = 0; i < waypoints.length; i++) {
      var prev = i === 0 ? 0 : i - 1;
      graphic.moveTo(waypoints[prev].x + w, waypoints[prev].y + h);
      graphic.lineTo(waypoints[i].x + w, waypoints[i].y + h);
      graphic.drawCircle(waypoints[i].x + w, waypoints[i].y + h, 5);
    }
    render_layer_top.addGraphic(graphic);
    render();
  };
  $scope.renderWaypoints = renderWaypoints;

  $scope.selectEntity = function(entity) {
    clearTopLayer();
    if ($scope.current_tool === $scope.Tool.Paint) {
      $scope.current_selected_entity = entity;
    } else if ($scope.current_tool === $scope.Tool.Inspect) {
      $scope.current_inspect_entity = entity;
      //renderWaypoints(entity);
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

    var render_layer = class_name === "FloorTile" ? render_layer_floor : render_layer_1;
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
    obj.opts.size = {
      width: $scope.tile_size,
      height: $scope.tile_size
    };
    obj.opts.row = row;
    obj.opts.col = col;
    //
    var entity = new window[obj.class_name](obj.opts);
    entity.trigger_events = [];
    entity.active_trigger = null;
    entity.createGraphic();

    for (var i = 0; i < entity.graphic_objects.length; i++) {
      var g = entity.graphic_objects[i].getGraphicObj();
      render_layer.addGraphic(g);
    };

    // Trigger on-remove-event
    entity.on('moved', function() {
      game.swapTile(entity);
      if (game.is_running) {
        game.checkCollision(entity);
      }
    }, this);

    game.addEntity(render_layer, [entity]);
    game.addTileToCell(col, row, entity);

    if (!game.is_running) {
      render();
    } else {
      entity.ready();
    }
    addEntityToCells(entity);
  };

  $scope.onCanvasMousedown = function(e) {
    if ($scope.is_drawing) return;
    var point = getPointOnCanvas(e);
    var cell = pointToCell(point);
    if ($scope.current_tool === $scope.Tool.Paint) {
      $scope.is_drawing = true;
      $scope.createEntity(point);
    } else if ($scope.current_tool === $scope.Tool.Delete) {
      clearCell(cell.col, cell.row);
    } else if ($scope.current_tool === $scope.Tool.Inspect) {
      clearTopLayer();
      $scope.current_inspect_entity = null;
      $scope.current_inspect_cell = $scope.cells[cell.col][cell.row];
    // Set a waypoint
    } else if ($scope.current_tool === $scope.Tool.SetWaypoint) {
      var norm_point = getNormPoint(point);
      $scope.setWaypoint(norm_point, cell);
    } else if ($scope.current_tool === $scope.Tool.SelectOtherObject) {
      $scope.selected_cell = $scope.cells[cell.col][cell.row];
      var entity = $scope.selected_cell[0];
      if (entity) {
        $scope.selectObject(entity);
      }
    } else if ($scope.current_tool === $scope.Tool.SelectCell) {
      $scope.selected_cell = $scope.cells[cell.col][cell.row];
      $scope.selectCell(cell, point);
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
    game = new PixiTileGame('canvas_container', $scope.width, $scope.height);
    render_layer_0 = game.addRenderLayer();
    render_layer_floor = game.addRenderLayer();
    render_layer_1 = game.addRenderLayer();
    render_layer_top = game.addRenderLayer();
    game.render_engine.addLayersToMainStage();

    grid = new Grid($scope.cols, $scope.rows, $scope.tile_size);
    buildGrid();
    render_layer_0.addGraphic(grid.getContainer());
    render();

    initGameObjects();
  };

  $scope.trigger_conditions = Condition.Trigger;
  $scope.trigger_actions = Condition.Action;

  $scope.createTrigger = function(entity) {
    var trigger = {
      conditions: [],
      actions: []
    };
    entity.trigger_conditions.push(trigger);
    $scope.setActiveTrigger(entity, trigger);
  };

  $scope.setActiveTrigger = function(entity, trigger) {
    entity.active_trigger = trigger;
  };

  $scope.removeTriggerByIndex = function(index) {
    var entity = $scope.current_inspect_entity;
    entity.trigger_conditions.splice(index, 1);
    entity.active_trigger = null;
    $scope.current_inspect_entity.active_trigger = null;
  };

  $scope.createTriggerCondition = function(condition_key) {
    var index = $scope.current_inspect_entity.active_trigger.conditions.length;
    $scope.current_inspect_entity.active_trigger.conditions.push({
      labels: { main: $scope.trigger_conditions[condition_key].label },
      class_name: condition_key
    });
    $scope.selectConditionByIndex(index);
  };

  $scope.createTriggerAction = function(key) {
    var index = $scope.current_inspect_entity.active_trigger.actions.length;
    $scope.current_inspect_entity.active_trigger.actions.push({
      labels: { main: $scope.trigger_actions[key].label },
      class_name: key
    });
    $scope.selectActionByIndex(index);
  };

  $scope.selectConditionByIndex = function(index) {
    $scope.current_inspect_entity.active_trigger.active_condition_index = index;
  };

  $scope.selectActionByIndex = function(index) {
    $scope.current_inspect_entity.active_trigger.active_action_index = index;
  };

  $scope.removeConditionByIndex = function(index) {
    $scope.current_inspect_entity.active_trigger.conditions.splice(index, 1);
  };

  $scope.removeActionByIndex = function(index) {
    $scope.current_inspect_entity.active_trigger.actions.splice(index, 1);
  };

  $scope.doneTriggerSet = function() {
    $scope.current_inspect_entity.active_trigger.active_action_index = null;
    $scope.current_inspect_entity.active_trigger.active_condition_index = null;
  };

  $scope.getConditionLabel = function(condition) {
    var label = "";
    for (var l in condition.labels) {
      label += condition.labels[l];
    }
    return label;
  };

  $scope.getActiveCondition = function() {
    return $scope.current_inspect_entity.active_trigger.conditions[$scope.current_inspect_entity.active_trigger.active_condition_index];
  };

  $scope.getActiveAction = function() {
    return $scope.current_inspect_entity.active_trigger.actions[$scope.current_inspect_entity.active_trigger.active_action_index];
  };


  /*
    Trigger
  */

  $scope.setTriggerEvent = function(entity, event_key) {
    if (!entity.active_trigger) return;
    entity.active_trigger.trigger_event = event_key;
  };

  $scope.selectOtherObject = function(scope, fn) {
    $scope.after_select_object_fn = scope[fn];
    $scope.setTool($scope.Tool.SelectOtherObject);
  };

  $scope.selectCellOnMap = function(scope, fn) {
    $scope.after_select_object_fn = scope[fn];
    $scope.setTool($scope.Tool.SelectCell);
  };

  $scope.selectCell = function(cell, point) {
    if ($scope.after_select_object_fn) {
      $scope.after_select_object_fn(cell, point, true);
    }
    $scope.after_select_object_fn = null;
    $scope.setTool($scope.Tool.Inspect);
  };

  $scope.selectObject = function(entity) {
    if ($scope.after_select_object_fn) {
      $scope.after_select_object_fn(entity, true);
    }
    $scope.after_select_object_fn = null;
    $scope.setTool($scope.Tool.Inspect);
  };

  $scope.selectWaypointProxy = function(scope, fn) {
    $scope.after_set_wp_fn = scope[fn];
    $scope.setTool($scope.Tool.SetWaypoint);
  };

  $scope.setWaypoint = function(point, cell) {
    if ($scope.after_set_wp_fn) {
      $scope.after_set_wp_fn(point, cell, renderWaypoints);
    }
  };
}]);
