'use strict';

/* App Module */

var pupinoApp = angular.module('pupinoApp', [
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

/* Controllers */

pupinoApp.controller('MainController', function($scope) {

});
