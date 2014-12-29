'use strict';

pupinoReports.controller('ProjectController', function($scope, resolvedProject, Project, BuildProject, UtilsService) {

    $scope.projects = resolvedProject;

    $scope.builds = [];

    angular.forEach($scope.projects, function(project) {
        var that = this;
        BuildProject.findLastBuild(project).success(function(data) {
            console.log(data)
            that[project.id] = data;
            // that.push(data);
        })

    }, $scope.builds);


    $scope.create = function() {
        console.log($scope.project);

        Project.save($scope.project, function() {
            $scope.projects = Project.query();
            $('#saveProjectModal').modal('hide');
            $scope.clear();
        }, function(error) {
            toastr.error("It was not possible to create the project!")
        });
    };

    $scope.update = function(id) {
        $scope.project = Project.get({
            id: id
        });
        $('#saveProjectModal').modal('show');
    };

    $scope.delete = function(id) {
        Project.delete({
                id: id
            },
            function() {
                $scope.projects = Project.query();
            });
    };

    $scope.clear = function() {
        $scope.project = {
            name: null,
            description: null,
            id: null
        };
    };

    $scope.calcPerCent = function(value, total) {
        return UtilsService.calcPerCent(value, total);
    }


});
