'use strict';

pupinoApp.controller('ProjectController', function ($scope, resolvedProject, Project) {

        $scope.projects = resolvedProject;

        $scope.create = function () {
            Project.save($scope.project,
                function () {
                    $scope.projects = Project.query();
                    $('#saveProjectModal').modal('hide');
                    $scope.clear();
                });
        };

        $scope.update = function (id) {
            $scope.project = Project.get({id: id});
            $('#saveProjectModal').modal('show');
        };

        $scope.delete = function (id) {
            Project.delete({id: id},
                function () {
                    $scope.projects = Project.query();
                });
        };

        $scope.clear = function () {
            $scope.project = {name: null, description: null, id: null};
        };

        
    });
