miniumDeveloper.factory('StepProvider', function($http) {
    return {
        all: function() {
            return $http.get("app/rest/snippets");
        }
    };
});
