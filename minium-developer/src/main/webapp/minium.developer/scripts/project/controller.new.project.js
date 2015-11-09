'use strict';

angular.module('minium.developer')
    .controller('ProjectController', function($scope, $translate, $filter, $modalInstance, ProjectFactory, ProjectService) {

        var $translate = $filter('translate');
        $scope.project = {};

        var directoryMsgTemplate = {
            success: '<span class="fa fa-check" style="color:green;"></span>' + $translate("messages.valid_directory"),
            error: '<span class="fa fa-remove" style="color:#FF0004;"></span> ' + $translate("messages.invalid_directory")
        }

        var projectMsgTemplate = {
            success: '<span class="fa fa-check" style="color:green;"></span> ' + $translate("messages.project_exists"),
            error: '<span class="fa fa-remove" style="color:#FF0004;"></span> ' + $translate("messages.project_already")
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

        $scope.popoverDirectoryInput = $translate('messages.popover.directory_input');

        $scope.isValidJavaPackageName = function() {

            if (!isValidGroupId($scope.project.groupId)) {
                $scope.projectForm.groupId.$setValidity("default1", false);
                return false;
            } else {
                $scope.projectForm.groupId.$setValidity("default1", true);
                return true; // valid
            }
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

        var isValidProjectName = function(projectName) {
            return /^[a-zA-Z0-9\._-]*$/.test(projectName);
        }

        var isValidGroupId = function(groupId) {
            return /^([a-z_]{1}[a-z0-9_]*(\.[a-z_]{1}[a-z0-9_]*)*)$/i.test(groupId);
        }

        $scope.validate = function(e) {

            var str = $scope.project.name;
            if (isValidProjectName(str) == false) {
                $scope.isValid = false;
                $scope.msg.directory = '';
                $scope.msg.project = $translate('messages.illegal_chars');
                $scope.msg.projectType = '';
                return;
            }

            $scope.validatingProject = true;
            var name = $scope.project.name || "";

            if (name === "") {
                $scope.validatingProject = false;
                return;
            }
            $scope.project.artifactId = name.replace(/\s+/g, '-');
            var path = $scope.location;

            ProjectFactory.isValidName(path).success(function(data) {
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

                    //dir is wrong and theres no project
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

        $scope.$watch('project.directory + project.name', function(newValues, oldValues, scope) {
            var projectName = $scope.project.name || "";
            var projectDirectory = $scope.project.directory || "";
            $scope.location = projectDirectory + "/" + projectName;
        });

        $scope.submitForm = function() {
            if (!$scope.projectForm.$valid || !$scope.isValid || !isValidProjectName($scope.project.name)) {
                toastr.error($translate('form_invalid'));
                return;
            }
            ProjectFactory.create($scope.project).success(function(data) {
                if (data == "true") {
                    toastr.success($translate('messages.created'));
                    ProjectService.storeOpenProjects($scope.location);
                    ProjectService.reload($scope.location);
                } else {
                    toastr.error($translate('messages.cannot_create_project'));
                }
            }).error(function(data, status) {
                toastr.error($translate('messages.cannot_create_project'));
            });
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            $scope.$dismiss();
        };


        $scope.activate('automator');
    });
