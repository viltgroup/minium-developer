'use strict';

miniumManager
    .config(function($stateProvider, $httpProvider, $translateProvider,modalStateProvider, USER_ROLES) {

        $stateProvider
            .state('global.project', {
                url: "/project",
                templateUrl: 'minium.manager/views/project/index.html',
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
                templateUrl: 'minium.manager/views/project/show.html',
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
                templateUrl: 'minium.manager/views/project/partials/project-overview.html'
            })
           
            .state('global.project-detail.builds', {
                templateUrl: 'minium.manager/views/project/partials/build.html',
                controller: function($scope, $state) {
                     $state.go('.grid');
                }
            })
            .state('global.project-detail.builds.grid', {
                templateUrl: 'minium.manager/views/project/partials/build.grid.html'
            })
            .state('global.project-detail.builds.list', {
                templateUrl: 'minium.manager/views/project/partials/build.list.html'
            })
            .state('global.project-detail.features-list', {
                templateUrl: 'minium.manager/views/project/partials/features-list.html'
            })
            .state('global.project-detail.configuration', {
                templateUrl: 'minium.manager/views/project/partials/configuration.html'
            })

            //configuration of the launch
            modalStateProvider.state('global.project-detail.overview.launch', {
                templateUrl: "minium.manager/views/project/partials/launch.html",
                controller: "LaunchController",
                resolve: {
                    resolvedProject: ['Project', '$stateParams', function(Project, $stateParams) {
                        return Project.get({
                            id: $stateParams.id
                        }).$promise;
                    }]
                }
            });
    });
