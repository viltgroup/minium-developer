'use strict';

/* App Module */
var pupinoApp = angular.module('pupinoApp', [
	'minium.components',
	'pupinoIDE',
    'pupinoReports'
])

.config(function($httpProvider, $urlRouterProvider, $stateProvider) {
    // Now set up the states
    $stateProvider
        .state('global', {
            templateUrl: "views/global.html",
            controller: "GlobalController"
        });
});