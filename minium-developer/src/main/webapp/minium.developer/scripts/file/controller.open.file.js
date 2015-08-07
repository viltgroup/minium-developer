(function() {
    'use strict';

    angular.module('minium.developer')
        .controller('OpenFileController', OpenFileController);

    OpenFileController.$inject = ['$rootScope', '$scope', '$modalInstance', '$controller', '$stateParams', 'TabLoader', 'FS', 'MiniumEditor'];

    function OpenFileController($rootScope, $scope, $modalInstance, $controller, $stateParams, TabLoader, FS, MiniumEditor) {

        console.debug("loaded FileController")
            //extends the fileController
        $controller('FileController', {
            $scope: $scope
        });
        //access the scope of the parent state
        //had to do this because we dont have access
        //to the parent scope with modalProvider
        var parentScope = MiniumEditor.getScope();

        $scope.form = {};

        $scope.type = $stateParams.type | '';

        $scope.ok = function() {
            $scope.$close(true);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            $scope.$dismiss();
        };

         $scope.search = function() {
            var searchQuery = $scope.form.searchQuery;
            $scope.results = FS.search({
                q: searchQuery
            });
        };

        $scope.searchContent = function() {
            var searchQuery = $scope.form.searchQuery;
            if (searchQuery.length <= 3) {
                return;
            }

            $scope.resultPromise = FS.searchContent({
                q: searchQuery
            }).$promise.then(function(result) {
                $scope.resultsForContentSearch = result;
            })

        };

        $scope.select = function(item, line) {
            console.log($scope)
            parentScope.loadFile(decodeURIComponent(item.relativeUri)).then(function(result) {
                if (line) {
                    $rootScope.active.session.gotoLine(line);
                }
            });
        }
    }

})();
