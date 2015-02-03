'use strict';

miniumManager
    .config(function($stateProvider, $httpProvider, $translateProvider, USER_ROLES) {

        $stateProvider
            .state('global.feature', {
                url: "/project/:id/build/:buildId/*featureURI",
                templateUrl: 'minium.manager/views/feature/show.html',
                controller: 'FeatureController',
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
            .state('global.feature.scenarios', {
                templateUrl: 'minium.manager/views/feature/partials/details.html'
            })
             .state('global.feature.failling', {
                templateUrl: 'minium.manager/views/feature/partials/tab-failling-list.html'
            })
             .state('global.feature.stats', {
                templateUrl: 'minium.manager/views/feature/partials/tab-statistic.html'
            })
    });
