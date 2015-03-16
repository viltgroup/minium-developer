'use strict';

angular.module('minium.developer')
    .controller('ProjectController', function($scope, $modalInstance, ProjectFactory,ProjectService, GENERAL_CONFIG) {

        $scope.project = {};


        var directoryMsgTemplate = {
            success: '<span class="fa fa-check" style="color:green;"></span> Directory is valid',
            error: '<span class="fa fa-remove" style="color:#FF0004;"></span> Directory invalid'
        }

        var projectMsgTemplate = {
            success: '<span class="fa fa-check" style="color:green;"></span> Project exists',
            error: '<span class="fa fa-remove" style="color:#FF0004;"></span> There\'s already a project in this path!!'
        }

        //possible modes of a project after validation
        var projectEnum = {
            VALID: 'Valid',
            NOT_VALID: 'Not valid',
            NO_PROJECT: 'No project here',
            FILE_EXISTS: 'File exists',
        };

        $scope.msg = {
            directory: '',
            project: '',
            projectType: ''
        }

        $scope.popoverDirectoryInput = GENERAL_CONFIG.POPOVER.DIRECTORY_INPUT
        
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
            var name = $scope.project.name || "";

            if (name === "") {
                $scope.validatingProject = false;
                return;
            }
            $scope.project.artifactId = name.replace(/\s+/g, '-');
            var path = $scope.location;

            ProjectFactory.isValidName(path).success(function(data) {
                console.debug(data)
                if (data !== projectEnum.NOT_VALID && data === projectEnum.NO_PROJECT) {
                    //dir is good and theres a project
                    $scope.isValid = true;
                    $scope.msg.directory = directoryMsgTemplate.success;
                    $scope.msg.project = '';
                    $scope.msg.projectType = '';
                } else if (data !== projectEnum.NO_PROJECT && data !== projectEnum.NOT_VALID) {
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
                $scope.isValid = false;
                $scope.msg.directory = directoryMsgTemplate.error;
                $scope.validatingProject = false;
            });
        }
        
        $scope.$watchGroup(['project.directory', 'project.name'], function(newValues, oldValues, scope) {
            var projectName = $scope.project.name || "";
            var projectDirectory = $scope.project.directory || "";
            $scope.location = projectDirectory + "/" + projectName;
        });

        $scope.submitForm = function() {
            if (!$scope.isValid) {
                toastr.error("Form is invalid");
                return;
            }
            ProjectFactory.create($scope.project).success(function(data) {
                if (data == true) {
                    toastr.success("Project created");
                    ProjectService.storeOpenProjects($scope.location);
                    ProjectService.reload($scope.location);
                } else {
                    toastr.error("Not possible to create the project");
                }
            }).error(function(data, status) {
                toastr.error("Not possible to create the project " + data.error);
            });
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            $scope.$dismiss();
        };


        $scope.activate('automator');
    });
