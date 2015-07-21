'use strict';

angular.module('minium.developer')
    .service('VersionService', ['$http', function($http){
        return {
            getVersionInfo: function() {
                return $http.get('app/rest/version');
            },
            checkForNewVersion: function() {
                return $http.get('app/rest/version/new');
            },
        };
    }]);
