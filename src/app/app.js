var Config = {
  // @const {String} APP_NAME - The name of the angular module
  APP_NAME: 'fiestamanApp',
  // @var {Object} dependencies - Dictionary of the angular dependency modules
  dependencies: {
    controllers: 'fiestamanAppControllers',
    services: 'fiestamanAppServices',
    directives: 'fiestamanAppDirectives',
    filters: 'fiestamanAppFilters'
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

var FiestamanApp = FiestamanApp || {
  app: null,
  services: null,
  controllers: null,
  directives: null
};

/**
 * Provide shortcut and to avoid long module code.
 * Instead use it like:
 *   FiestamanApp.controllers.controller('YourCtrl', ['$scope', function ($scope) { ... }]);
 */
FiestamanApp.controllers = angular.module(Config.dependencies.controllers, []);
FiestamanApp.services = angular.module(Config.dependencies.services, []);
FiestamanApp.directives = angular.module(Config.dependencies.directives, []);
FiestamanApp.filters = angular.module(Config.dependencies.filters, []);

FiestamanApp.app = angular.module(Config.APP_NAME, Config.getDependencies());

FiestamanApp.app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'src/app/partials/_main_menu_view.html'
      }).
      when('/main', {
        templateUrl: 'src/app/partials/_main_menu_view.html'
      }).
      when('/game', {
        templateUrl: 'src/app/partials/_game_view.html',
        controller: 'GameCtrl'
      }).
      when('/session_end', {
        templateUrl: 'src/app/partials/_session_win_view.html',
        controller: 'GameCtrl'
      }).
      when('/highscore', {
        templateUrl: 'src/app/partials/_highscore_view.html'
      }).
      when('/log', {
        templateUrl: 'src/app/partials/_log_view.html'
      }).
      otherwise({
        redirectTo: '/'
      });
  }]);
