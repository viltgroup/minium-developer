miniumDeveloper.factory('SelectorGadgetService', function($http) {
    return {
        activate: function() {
            return $http.post("app/rest/js/selectorGadget/activate");
        },
        deactivate: function() {
            return $http.post("app/rest/js/selectorGadget/deactivate");
        },
        cssSelector: function() {
            return $http.post("app/rest/js/selectorGadget/cssSelector");
        }
    };
})
