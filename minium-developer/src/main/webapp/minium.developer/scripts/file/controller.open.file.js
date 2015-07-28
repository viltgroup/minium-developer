'use strict';

angular.module('minium.developer')
    .controller('OpenFileController', function($scope, $modalInstance, $controller, $stateParams, FS, TabLoader, MiniumEditor) {

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

        $scope.search = function() {
            var searchQuery = $scope.form.searchQuery;
            $scope.results = FS.search({
                q: searchQuery
            });
        };

        $scope.select = function(item) {
            parentScope.loadFile(item.relativeUri);
            $scope.$close(true);
        };

        $scope.ok = function() {
            $scope.$close(true);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            $scope.$dismiss();
        };

    });
