'use strict';

pupinoReports
    .config(function($stateProvider, $httpProvider, $translateProvider, USER_ROLES) {

        $stateProvider
            .state('global.project', {
                url: "/project",
                templateUrl: 'pupino-reports/views/project/index.html',
                controller: 'ProjectController',
                resolve: {
                    resolvedProject: ['Project', function(Project) {
                        return Project.query().$promise;
                    }]
                },
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .state('global.project-detail', {
                url: "/project/:id",
                templateUrl: 'pupino-reports/views/project/show.html',
                controller: 'ProjectDetailController',
                resolve: {
                    resolvedProject: ['Project', '$stateParams', function(Project, $stateParams) {
                        return Project.get({
                            id: $stateParams.id
                        }).$promise;
                    }]
                },
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .state('global.project-detail.overview', {
                templateUrl: 'pupino-reports/views/project/partials/project-overview.html'
            })
            .state('global.project-detail.builds', {
                templateUrl: 'pupino-reports/views/project/partials/build.html',
                controller: function($scope, $state) {
                     $state.go('.grid');
                }
            })
            .state('global.project-detail.builds.grid', {
                templateUrl: 'pupino-reports/views/project/partials/build.grid.html'
            })
            .state('global.project-detail.builds.list', {
                templateUrl: 'pupino-reports/views/project/partials/build.list.html'
            })
            .state('global.project-detail.features-list', {
                templateUrl: 'pupino-reports/views/project/partials/features-list.html'
            })
    });
