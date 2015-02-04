'use strict';

miniumManager.controller('ProjectDetailController', function($scope, $state, $interval, resolvedProject, Project, JenkinsProvider, BuildsFacade, BuildProject, EstimationTime, UtilsService) {
    //init variables
    $scope.project = resolvedProject;


    $scope.summary = {
        totalScenarios: 0,
        passed: 0,
        failed: 0
    }

    $scope.buildsFacade;
    var buildSuccess, buildFailling;

    //enter in substate (a tab)
    $state.go('.overview');


    var getBuilds = function() {
        $scope.estimatedTime = 0;
        $scope.faillingFeatures = [];
        $scope.passingFeatures = [];

        BuildProject.findByProject($scope.project).success(function(data) {
            //check if has builds
            if (isEmptyObject(data)) {
                return;
            }
            $scope.buildsFacade = new BuildsFacade(data);

            console.log($scope.buildsFacade);

            //get some stats
            $scope.buildsFacade.processReport($scope.summary, $scope.faillingFeatures, $scope.passingFeatures);
            // var summary = buildsFacade.getSummary();
            // buildSuccess = summary.passingScenarios;
            //buildFailling = summary.faillingScenarios;

            //
            if ($scope.buildsFacade.buildingBuilds == 0) {
                console.debug("NOOOOO MORE BUILDDSSS")
                $scope.stop();
            }
            processData();

        }).error(function(serverResponse) {
            console.log(serverResponse);
        });

    }

    $scope.getCenas = function(a) {
        alert(a)
    }

    //REFACTOR
    var colorArray = ['green', 'red', '#f39c12'];
    $scope.colorFunction = function() {
        return function(d, i) {
            return colorArray[i];
        };
    }

    var processData = function() {
        $scope.exampleData = [{
            "key": "Sucess",
            "values": buildSuccess,
        }, {
            "key": "Failling",
            "values": buildFailling
        }];

        $scope.exampleData1 = [{
            key: "Passing",
            y: ($scope.summary.passed / 100)
        }, {
            key: "Failling",
            y: ($scope.summary.failed / 100)
        }, {
            key: "Skipped",
            y: ($scope.summary.skipped / 100)
        }];
    }


    $scope.xFunction = function() {
        return function(d) {
            return d.key;
        };
    }
    $scope.yFunction = function() {
        return function(d) {
            return d.y;
        };
    }

    $scope.yAxisFormatFunction = function() {
        return function(d) {
            return d3.format('%')(d);
        }
    }


    $scope.estimatedTime = 0;
    /** WEBSOCKETS */
    var socket;
    var subscribeBuilding = function() {
        var session_id = $scope.readCookie("JSESSIONID");
        socket = new SockJS("/app/ws");
        var stompClient = Stomp.over(socket);
        stompClient.connect({}, function(frame) {
            stompClient.subscribe("/building/" + session_id + "/project/" + $scope.project.id, function(data) {
                console.debug(data);

                //data arrive like duration-timestamp ("2222-14000000")
                var res = data.body.split("-");
                //return data 
                estimationTime(parseInt(res[1]), parseInt(res[0]));
                $scope.duration = parseInt(res[0]);
                $scope.time = moment(parseInt(res[1])).format('YYYY-MM-DD HH:mm');

            });
        });
    };


    $scope.duration = 0;
    $scope.time = 0;

    var stop;
    var estimationTime = function(timestamp, duration) {
        //create an object to calculate the estimation for the build progress
        var estimation = new EstimationTime(timestamp, duration);

        if (angular.isDefined(stop)) return;

        stop = $interval(function() {
            //return the progress of the build
            $scope.estimatedTime = estimation.currentTime();
            $scope.estimatedRemainning = estimation.duration();
            if ($scope.estimatedTime >= 110) {
                console.log("Stopeedes")
                //$scope.stop();
                //update the builds
                getBuilds();
            }
        }, 1000);


    }

    //function to stop the interval
    //created to check the status of the build
    $scope.stop = function() {
        if (angular.isDefined(stop)) {
            $interval.cancel(stop);
            stop = undefined;
        }
    }


    $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $scope.stop();
    });

    $scope.calcPerCent = function(value, total) {
        return UtilsService.calcPerCent(value, total);
    }

    /*
       Initializations
    */

    //get all the builds
    getBuilds();

    //only need to do it when the project has a build
    subscribeBuilding();


    $scope.$on('trackLoaded', function(event, track) {
        $scope.buildsFacade = track;
        console.log($scope.buildsFacade);
    });


    var isEmptyObject = function(obj) {

        if (obj.length && obj.length > 0)
            return false;

        if (obj.length === 0)
            return true;
    }


    $scope.isPassed = function(value) {
        return (value === "PASSED") ? true : false;
    }


});
