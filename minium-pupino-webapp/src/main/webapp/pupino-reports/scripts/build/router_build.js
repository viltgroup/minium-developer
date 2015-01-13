'use strict';

pupinoReports
    .config(function($stateProvider, $httpProvider, $translateProvider, USER_ROLES) {

         $stateProvider
            .state('global.build', {
                url: "/project/:id/build/:buildId",
                templateUrl: 'pupino-reports/views/build/show.html',
                controller: 'BuildJenkinsController',
                resolve: {
                    resolvedProject: ['Project','$stateParams' ,function(Project,$stateParams) {
                        return Project.get({id: $stateParams.id}).$promise;
                    }],
                    resolvedBuild: ['Build','$stateParams' , function(Build, $stateParams) {
                        return Build.get({
                            id: $stateParams.buildId
                        }).$promise;
                    }]
                },
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .state('global.build.features', {
                templateUrl: 'pupino-reports/views/build/partials/features.list.html'
            })
             .state('global.build.stats', {
                templateUrl: 'pupino-reports/views/build/partials/statistics.html'
            })
            .state('global.build-detail', {
                url: "/build/:id",
                templateUrl: 'pupino-reports/views/build/builds.html',
                controller: 'BuildController',
                resolve: {
                     resolvedBuild: ['Build', function(Build, $stateParams) {
                        return Build.get({
                            id: 1
                        }).$promise;
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
