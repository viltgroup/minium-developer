(function() {
    'use strict';

    angular.module('minium.developer')
        .controller('SearchFileController', SearchFileController);

    SearchFileController.$inject = ['$rootScope', '$scope', '$modalInstance', '$controller', '$stateParams', 'TabLoader', 'FS', 'MiniumEditor'];

    function SearchFileController($rootScope, $scope, $modalInstance, $controller, $stateParams, TabLoader, FS, MiniumEditor) {

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
        $scope.isActive = true;
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
            parentScope.loadFile(decodeURIComponent(item.relativeUri)).then(function(result) {
                if (line) {
                    $rootScope.activeEditor.instance.gotoLine(line);
                }
            });
        }

        //////////////////////////////////////////////////////////////////
        // On enter in controller
        //////////////////////////////////////////////////////////////////
        if ($stateParams.line) {
            $scope.form.searchQuery = $stateParams.line;
            $scope.searchContent();
        }

    }

})();
