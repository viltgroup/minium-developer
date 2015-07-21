/**
 * Provide Cucumber snippets
 *
 */
miniumDeveloper.service('MiniumMethodsProvider', ['$http', function($http) {

            this.getMethods = function() {
                return $http.get('minium.developer/ext/minium/methods.json');
            }
        }]);
