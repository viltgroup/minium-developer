'use strict';

angular.module('minium.developer')
    .controller('ProjectController', function($scope, $modalInstance, ProjectFactory, GENERAL_CONFIG) {

        $scope.project = {};


        var directoryMsgTemplate = {
            success: '<span class="fa fa-check" style="color:green;"></span> Directory is valid',
            error: '<span class="fa fa-remove" style="color:#FF0004;"></span> Directory invalid'
        }

        var projectMsgTemplate = {
            success: '<span class="fa fa-check" style="color:green;"></span> Project exists',
            error: '<span class="fa fa-remove" style="color:#FF0004;"></span> There\'s already a project"'
        }

        $scope.msg = {
            directory: '',
            project: '',
            projectType: ''
        }


        //////////////////////////////////////////////////////////////////
        // Functions
        //////////////////////////////////////////////////////////////////
        /**
         *   Radio buttons
         *   Set the value on click
         **/
        $scope.activate = function(value) {
            $scope.project.type = value;
        }

        $scope.validate = function(e) {
            $scope.validatingProject = true;
            ProjectFactory.isValid($scope.project.directory).success(function(data) {
                if (data !== 'Not valid' && data === 'No project here') {
                    //dir is good and theres a project
                    $scope.isValid = true;
                    $scope.msg.directory = directoryMsgTemplate.success;
                    $scope.msg.project = '';
                    $scope.msg.projectType = '';
                } else if (data !== 'No project here') {
                    //dir is valid but no projects
                    $scope.isValid = false;
                    $scope.msg.directory = directoryMsgTemplate.success;
                    $scope.msg.project = projectMsgTemplate.error;
                    $scope.msg.projectType = '';

                } else {
                    //dir is worng and theres no project
                    $scope.isValid = false;
                    $scope.msg.directory = directoryMsgTemplate.error;
                    $scope.msg.project = '';
                    $scope.msg.projectType = '';
                }
                $scope.validatingProject = false;
            }).error(function(data, status) {
                console.error('Repos error', status, data);
                $scope.validatingProject = false;
            });
        }

        $scope.submitForm = function() {
            if (!$scope.isValid) {
                toastr.error("Form is invalid");
                return;
            }
            ProjectFactory.create($scope.project).success(function(data) {
                alert(data)
            }).error(function(data, status) {
                console.error('Project error', status, data);
            });
        }
        $scope.activate('automator');
    });
