miniumDeveloper.factory('FeaturePreviewService', function($http) {
    return {
        preview: function(params) {
            return $http.post("/app/rest/preview",params);
        }
    };
})
