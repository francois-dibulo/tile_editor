var Config = {
  // @const {String} APP_NAME - The name of the angular module
  APP_NAME: 'gameEditor',
  // @var {Object} dependencies - Dictionary of the angular dependency modules
  dependencies: {
    controllers: 'gameEditorControllers',
    services: 'gameEditorServices',
    directives: 'gameEditorDirectives',
    filters: 'gameEditorFilters'
  },

  /**
   * @desc Returns list of dependencies
   * @return {Array}
   */
  getDependencies: function() {
    var dependencies = [];
    for(var depenceny in this.dependencies) {
      dependencies.push(this.dependencies[depenceny]);
    }
    dependencies.push('ngRoute');
    return dependencies;
  }
};

var GameEditor = GameEditor || {
  app: null,
  services: null,
  controllers: null,
  directives: null
};

/**
 * Provide shortcut and to avoid long module code.
 * Instead use it like:
 *   GameEditor.controllers.controller('YourCtrl', ['$scope', function ($scope) { ... }]);
 */
GameEditor.controllers = angular.module(Config.dependencies.controllers, []);
GameEditor.services = angular.module(Config.dependencies.services, []);
GameEditor.directives = angular.module(Config.dependencies.directives, []);
GameEditor.filters = angular.module(Config.dependencies.filters, []);

GameEditor.app = angular.module(Config.APP_NAME, Config.getDependencies());

GameEditor.app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'src/editor/partials/_build_view.html'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
