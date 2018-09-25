'use strict';

angular.module('minium.developer')
    .controller('DependenciesController', function($scope, $filter, $modalInstance, ProjectFactory) {

        var $translate = $filter('translate');

        $scope.loadedDependencies = [];

        function getDependencies() {
            ProjectFactory.getDependencies().success(function(dependencies) {
                $scope.loadedDependencies = dependencies;
            });
        }

        $scope.updateDependencies = function() {
            var ladda = Ladda.create(document.querySelector('#updateDependenciesBtn')).start();
            ProjectFactory.updateDependencies().success(function(dependencies) {
                $scope.loadedDependencies = dependencies;
                toastr.success($translate('project.dependencies.messages.update_succeeded'));
            }).error(function() {
                toastr.error($translate('project.dependencies.messages.update_failed'));
            }).finally(function() {
                ladda.stop();
            });
        }

        $scope.removeJarExtension = function(filename) {
            return filename.endsWith(".jar") ? filename.slice(0, -4) : filename;
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            $scope.$dismiss();
        };

        getDependencies();
    });