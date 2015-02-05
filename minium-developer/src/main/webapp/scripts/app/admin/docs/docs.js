'use strict';

angular.module('miniumdevApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('docs', {
                parent: 'global',
                url: '/docs',
                data: {
                    roles: []
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/admin/docs/docs.html'
                    }
                }
            });
    });
