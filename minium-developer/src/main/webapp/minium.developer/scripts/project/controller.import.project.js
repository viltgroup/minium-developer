'use strict';

angular.module('minium.developer')
    .controller('ImportProjectController', function($scope, $window, $modalInstance, $cookieStore, GENERAL_CONFIG, ProjectService, ProjectFactory) {


        //////////////////////////////////////////////////////////////////
        // INIT VARABLES
        //////////////////////////////////////////////////////////////////
        $scope.path = "";
        $scope.isValid;
        $scope.isValidPorject;
        $scope.validatingProject = false;

        var directoryMsgTemplate = {
            success: '<span class="fa fa-check" style="color:green;"></span> Directory is valid',
            error: '<span class="fa fa-remove" style="color:#FF0004;"></span> Directory invalid'
        }

        var projectMsgTemplate = {
            success: '<span class="fa fa-check" style="color:green;"></span> Project exists',
            error: '<span class="fa fa-remove" style="color:#FF0004;"></span> No project here'
        }

        $scope.msg = {
            directory: '',
            project: '',
            projectType: ''
        }

        //////////////////////////////////////////////////////////////////
        // Functions
        //////////////////////////////////////////////////////////////////
        $scope.validate = function(e) {
             if(!$scope.path){
                return;
            }
            $scope.validatingProject = true;
            ProjectFactory.isValid($scope.path).success(function(data) {
                if (data !== 'Not valid' && data !== 'No project here') {
                    //dir is good and theres a project
                    $scope.isValid = true;
                    $scope.msg.directory = directoryMsgTemplate.success;
                    $scope.msg.project = projectMsgTemplate.success;
                    $scope.msg.projectType = "Type of project: " + data;
                } else if (data === 'No project here') {
                    //dir is valid but no projects
                    $scope.isValid = false;
                    $scope.msg.directory = directoryMsgTemplate.success;
                    $scope.msg.project = projectMsgTemplate.error;
                    $scope.msg.projectType = '';

                } else {
                    //dir is worng and theres no project
                    $scope.isValid = false;
                    $scope.msg.directory = directoryMsgTemplate.error;
                    $scope.msg.project = projectMsgTemplate.error;
                    $scope.msg.projectType = '';
                }
                $scope.validatingProject = false;
            }).error(function(data, status) {
                console.error('Repos error', status, data);
                $scope.validatingProject = false;
            });
        }

        
        //put this in a service in order to re user
        $scope.importProject = function(path) {
            if(!path){
                return;
            }
            ProjectService.open(path);
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            $scope.$dismiss();
        };

        $scope.select = function(project){
            $scope.path = project;
            $scope.validate();
        }


        //initializations
        $scope.lastProjects = ProjectService.getOpenProjects();

    });
