'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('cucumby', [
  'ngResource',
	'ui.router',
  'ui.ace',
  'ui.bootstrap',
  'ui.bootstrap.showErrors',
  'nvd3ChartDirectives',
  'cucumby.filters',
  'cucumby.services',
  'cucumby.directives',
  'cucumby.controllers'
]);

app
  .provider('modalState', function($stateProvider) {
    var provider = this;
    this.$get = function() {
      return provider;
    }
    this.state = function(stateName, options) {
      var modalInstance;
      $stateProvider.state(stateName, {
        url: options.url,
        onEnter: function($modal, $state) {
          modalInstance = $modal.open(options);
          modalInstance.result['finally'](function() {
            modalInstance = null;
            if ($state.$current.name === stateName) {
              $state.go('^');
            }
          });
        },
        onExit: function() {
          if (modalInstance) {
            modalInstance.close();
          }
        }
      });
    };
  })
  .config(function($stateProvider, modalStateProvider, $urlRouterProvider) {

    $urlRouterProvider
      .when("", "/editor/")
      .otherwise("/editor/");

    // Now set up the states
    $stateProvider
      .state('global', {
        url: "",
        templateUrl: "partials/global.html",
        controller: "GlobalController"
      })
      .state('global.dashboard', {
        url: "/dashboard",
        templateUrl: "partials/dashboard.html",
        controller: "GlobalController"
      })
      .state('global.editorarea', {
        url: "/editor/*path?line",
        templateUrl: "partials/editor.area.html",
        controller: "EditorAreaController"
      })
      .state('global.bugtracker', {
        url: "/bugtracker",
        templateUrl: "partials/bug-tracker.html",
        controller: "GlobalController"
      })
      .state('global.feature-report', {
        url: "/report/feature/*path",
        templateUrl: "partials/feature-report.html",
        controller: "GlobalController"
      })
      .state('global.report', {
        url: "/report/*path",
        templateUrl: "partials/report.html",
        controller: "ReportController"
      })
      .state('global.testSocket', {
        url: "/socket-test",
        templateUrl: "partials/socket-test.html",
        controller: "SocketTestController"
      });

    modalStateProvider
      .state('global.editorarea.open', {
        templateUrl: "partials/modal/open.file.html",
        controller: "OpenFileController"
      });

     modalStateProvider
      .state('global.editorarea.results', {
        templateUrl: "partials/modal/launch.html",
        controller: "LaunchController"
      });

    //configuration to execute the file
    modalStateProvider.state('global.editorarea.configs', {
        templateUrl: "partials/modal/configs.html",
        controller: "ConfigsController"
      });

  });
