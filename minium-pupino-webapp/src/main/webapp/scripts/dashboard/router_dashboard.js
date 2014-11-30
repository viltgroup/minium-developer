'use strict';

pupinoApp
    .config(function($stateProvider, $httpProvider, $translateProvider, USER_ROLES) {

        $stateProvider
            .state('global.dashboard', {
                url: "/dashboard",
                templateUrl: "views/dashboard/index.html",
                controller: "DashboardController"
            })
    });
