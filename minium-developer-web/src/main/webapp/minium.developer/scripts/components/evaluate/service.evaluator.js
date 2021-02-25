miniumDeveloper.factory('EvalService', function($http) {
    return {
        eval: function(evalOptions) {
            return $http.post('app/rest/js/eval', evalOptions);
        },
        clean: function() {
            return $http.post('app/rest/js/clean');
        }
    };
})
