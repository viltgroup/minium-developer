'use strict';

angular.module('minium.developer')
    .service('VersionService', ['$http', function($http){
        return {
            get: function() {
                return $http.get('app/rest/version');
            }
        };
    }]);
