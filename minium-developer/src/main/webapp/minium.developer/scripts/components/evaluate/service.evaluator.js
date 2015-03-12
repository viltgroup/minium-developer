miniumDeveloper.factory('EvalService', function($http) {
    return {
        eval: function(params) {
            return $http({
                method: "POST",
                url: '/app/rest/js/eval',
                data: params ? $.param(params) : '',
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });
        },
        clean: function() {
            return $http({
                method: "POST",
                url: '/app/rest/js/clean'
            });
        }
    };
})

