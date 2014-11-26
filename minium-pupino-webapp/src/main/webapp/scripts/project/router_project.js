'use strict';

pupinoApp
    .config(function($stateProvider, $httpProvider, $translateProvider, USER_ROLES) {

        $stateProvider
            .state('global.project', {
                url: "/project",
                templateUrl: 'views/project/index.html',
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
                templateUrl: 'views/project/show.html',
                controller: 'ProjectDetailController',
                resolve: {
                    resolvedProject: ['Project','$stateParams' ,function(Project,$stateParams) {
                        return Project.get({id: $stateParams.id}).$promise;
                    }]
                },
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
            .state('global.build', {
                url: "/project/:id/build/:number",
                templateUrl: 'views/project/build.html',
                controller: 'ProjectDetailController',
                resolve: {
                    resolvedProject: ['Project','$stateParams' ,function(Project,$stateParams) {
                        return Project.get({id: $stateParams.id}).$promise;
                    }]
                },
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
             .state('global.build-feature', {
                url: "/project/:id/build/:buildId/*featureURI",
                templateUrl: 'views/project/features-details.html',
                controller: 'FeatureController',
                resolve: {
                    resolvedProject: ['Project','$stateParams' ,function(Project,$stateParams) {
                        return Project.get({id: $stateParams.id}).$promise;
                    }]
                },
                access: {
                    authorizedRoles: [USER_ROLES.all]
                }
            })
    });
