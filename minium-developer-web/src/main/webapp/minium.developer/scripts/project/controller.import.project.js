'use strict';

angular.module('minium.developer')
    .controller('ImportProjectController', function($scope, $translate, $filter, $window, $modalInstance, $cookieStore, GENERAL_CONFIG, ProjectService, ProjectFactory, FS) {

        var $translate = $filter('translate');

        //////////////////////////////////////////////////////////////////
        // INIT VARABLES
        //////////////////////////////////////////////////////////////////
        $scope.path = "";
        $scope.isValid;
        $scope.isValidPorject;
        $scope.validatingProject = false;

        var directoryMsgTemplate = {
            success: '<span class="fa fa-check" style="color:green;"></span>' + $translate("messages.valid_directory"),
            error: '<span class="fa fa-remove" style="color:#FF0004;"></span> ' + $translate("messages.invalid_directory")
        }

        var projectMsgTemplate = {
            success: '<span class="fa fa-check" style="color:green;"></span> ' + $translate("messages.project_exists"),
            error: '<span class="fa fa-remove" style="color:#FF0004;"></span> ' + $translate("messages.no_project_exists")
        }

        $scope.msg = {
            directory: '',
            project: '',
            projectType: ''
        }

        //TODO need translation
        //////////////////////////////////////////////////////////////////
        // Functions
        //////////////////////////////////////////////////////////////////
        $scope.validate = function(e) {
            if (!$scope.path) {
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
                $scope.validatingProject = false;
            });
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
            $scope.$dismiss();
        };

        //put this in a service in order to re user
        $scope.importProject = function(path) {
            if (!path) {
                return;
            }
            var ladda = Ladda.create(document.querySelector('#openProjectBtn')).start();
            ProjectService.open(path).error(function() {
                ladda.stop();
            });
        }



        $scope.select = function(project) {
            $scope.path = project;
            $scope.validate();
        }


        //initializations
        $scope.lastProjects = ProjectService.getOpenProjects();


        $scope.fs = {
            current: {}
        };
        $scope.form = {};

        //focus on search input
        $scope.search = {
          name : ""
        };
        $scope.asyncLoad = function(node) {
            var params = {
                path: node.relativeUri || ""
            };
            node.children = FS.listAll(params, function() {
                _.each(node.children, function(item) {
                    // tree navigation needs a label property
                    item.label = item.name;
                    item.parent = node;
                });
            });
            $scope.fs.current.children = node.children;
            $scope.search.name = "";
        };

        $scope.loadParent = function() {
            var parent = $scope.fs.current.parent;
            if (!parent) return;
            $scope.fs.current = parent;
            $scope.loadChildren(parent);
        }

        $scope.loadChildren = function(item) {
            if (item.childrenLoaded) return;
            $scope.asyncLoad(item);
            item.childrenLoaded = true;
        };

         $scope.loadAndSelectParent = function(){
            $scope.loadParent();
            $scope.selectDir($scope.fs.current.absoluteUri)
        }


        $scope.enter = function(item) {
            $scope.fs.current = item;
            $scope.asyncLoad(item);
            $scope.selectDir($scope.fs.current.absoluteUri);
        };

        $scope.asyncLoad($scope.fs.current);

        $scope.selectDir = function(relativeUri) {
            $scope.path = relativeUri;
            $scope.validate();
        }

        $scope.pathSelectorIsVisible = false;
        $scope.togglePathSelectorVisibility = function() {
            $scope.pathSelectorIsVisible = !$scope.pathSelectorIsVisible;
        }
    });
