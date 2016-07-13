'use strict';

miniumDeveloper.factory('RecorderService', function($http) {
    return {
        getScript: function() {
            return $http.get("/app/rest/recorder/script");
        }
    };
});
