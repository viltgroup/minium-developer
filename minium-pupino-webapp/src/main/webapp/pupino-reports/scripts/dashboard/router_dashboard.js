'use strict';

pupinoReports
    .config(function($stateProvider, $httpProvider, $translateProvider, USER_ROLES) {

        $stateProvider
            .state('global.dashboard', {
                url: "/dashboard",
                templateUrl: "pupino-reports/views/dashboard/index.html",
                controller: "DashboardController",
                resolve: {
                	resolvedBuild: ['Build', function(Build) {
                        return Build.query().$promise;
                    }],
                    resolvedProject: ['Project', function(Project) {
                        return Project.query().$promise;
                    }]
                },
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
    });
