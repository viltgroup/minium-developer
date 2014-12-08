'use strict';

/* Services */

pupinoReports.factory('LanguageService', function($http, $translate, LANGUAGES) {
    return {
        getBy: function(language) {
            if (language == undefined) {
                language = $translate.storage().get('NG_TRANSLATE_LANG_KEY');
            }
            if (language == undefined) {
                language = 'en';
            }

            var promise = $http.get('i18n/' + language + '.json').then(function(response) {
                return LANGUAGES;
            });
            return promise;
        }
    };
});

pupinoReports.factory('Register', function($resource) {
    return $resource('app/rest/register', {}, {});
});

pupinoReports.factory('Activate', function($resource) {
    return $resource('app/rest/activate', {}, {
        'get': {
            method: 'GET',
            params: {},
            isArray: false
        }
    });
});

pupinoReports.factory('Account', function($resource) {
    return $resource('app/rest/account', {}, {});
});

pupinoReports.factory('Password', function($resource) {
    return $resource('app/rest/account/change_password', {}, {});
});

pupinoReports.factory('Sessions', function($resource) {
    return $resource('app/rest/account/sessions/:series', {}, {
        'get': {
            method: 'GET',
            isArray: true
        }
    });
});

pupinoReports.factory('MetricsService', function($http) {
    return {
        get: function() {
            var promise = $http.get('metrics/metrics').then(function(response) {
                return response.data;
            });
            return promise;
        }
    };
});

pupinoReports.factory('ThreadDumpService', function($http) {
    return {
        dump: function() {
            var promise = $http.get('dump').then(function(response) {
                return response.data;
            });
            return promise;
        }
    };
});

pupinoReports.factory('HealthCheckService', function($rootScope, $http) {
    return {
        check: function() {
            var promise = $http.get('health').then(function(response) {
                return response.data;
            });
            return promise;
        }
    };
});

pupinoReports.factory('LogsService', function($resource) {
    return $resource('app/rest/logs', {}, {
        'findAll': {
            method: 'GET',
            isArray: true
        },
        'changeLevel': {
            method: 'PUT'
        }
    });
});

pupinoReports.factory('AuditsService', function($http) {
    return {
        findAll: function() {
            var promise = $http.get('app/rest/audits/all').then(function(response) {
                return response.data;
            });
            return promise;
        },
        findByDates: function(fromDate, toDate) {
            var promise = $http.get('app/rest/audits/byDates', {
                params: {
                    fromDate: fromDate,
                    toDate: toDate
                }
            }).then(function(response) {
                return response.data;
            });
            return promise;
        }
    }
});

pupinoReports.factory('Session', function() {
    this.create = function(login, firstName, lastName, email, userRoles) {
        this.login = login;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.userRoles = userRoles;
    };
    this.invalidate = function() {
        this.login = null;
        this.firstName = null;
        this.lastName = null;
        this.email = null;
        this.userRoles = null;
    };
    return this;
});

pupinoReports.factory('AuthenticationSharedService', function($rootScope, $http, authService, Session, Account) {
    return {
        login: function(param) {
            var data = "j_username=" + encodeURIComponent(param.username) + "&j_password=" + encodeURIComponent(param.password) + "&_spring_security_remember_me=" + param.rememberMe + "&submit=Login";
            $http.post('app/authentication', data, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                ignoreAuthModule: 'ignoreAuthModule'
            }).success(function(data, status, headers, config) {
                Account.get(function(data) {
                    Session.create(data.login, data.firstName, data.lastName, data.email, data.roles);
                    $rootScope.account = Session;
                    authService.loginConfirmed(data);
                });
            }).error(function(data, status, headers, config) {
                $rootScope.authenticationError = true;
                Session.invalidate();
            });
        },
        valid: function(authorizedRoles) {

            $http.get('protected/authentication_check.gif', {
                ignoreAuthModule: 'ignoreAuthModule'
            }).success(function(data, status, headers, config) {
                if (!Session.login) {
                    Account.get(function(data) {
                        Session.create(data.login, data.firstName, data.lastName, data.email, data.roles);
                        $rootScope.account = Session;
                        if (!$rootScope.isAuthorized(authorizedRoles)) {
                            // user is not allowed
                            $rootScope.$broadcast("event:auth-notAuthorized");
                        } else {
                            $rootScope.$broadcast("event:auth-loginConfirmed");
                        }
                    });
                } else {
                    if (!$rootScope.isAuthorized(authorizedRoles)) {
                        // user is not allowed
                        $rootScope.$broadcast("event:auth-notAuthorized");
                    } else {
                        $rootScope.$broadcast("event:auth-loginConfirmed");
                    }
                }
            }).error(function(data, status, headers, config) {
                if (!$rootScope.isAuthorized(authorizedRoles)) {
                    $rootScope.$broadcast('event:auth-loginRequired', data);
                }
            });
        },
        isAuthorized: function(authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                if (authorizedRoles == '*') {
                    return true;
                }

                authorizedRoles = [authorizedRoles];
            }

            var isAuthorized = false;
            angular.forEach(authorizedRoles, function(authorizedRole) {
                var authorized = (!!Session.login &&
                    Session.userRoles.indexOf(authorizedRole) !== -1);

                if (authorized || authorizedRole == '*') {
                    isAuthorized = true;
                }
            });

            return isAuthorized;
        },
        logout: function() {
            $rootScope.authenticationError = false;
            $rootScope.authenticated = false;
            $rootScope.account = null;

            $http.get('app/logout');
            Session.invalidate();
            authService.loginCancelled();
        }
    };
});




pupinoReports.factory('JenkinsProvider', ['$resource', '$http', function($resource, $http) {
    return {
        builds: $resource('app/rest/jenkins/builds/:jobName', {}, {
            query: {
                method: 'GET',
                isArray: true
            }
        }),
        createBuild: function(project) {
            return $http.post('app/rest/jenkins/builds/create/' + project.name, {});
        },
        getFeatureBuild: function(project, buildId, featureURI) {
            return $http.get('app/rest/jenkins/builds/' + project.name + '/' + buildId + '/' + featureURI, {});
        }
    };
}]);

pupinoReports.factory('JenkinsProvider1', function($resource, $http) {
    return {
        getBuild: function(project, buildId, featureURI) {
            return $http.get('app/rest/jenkins/builds/' + project.name + '/' + buildId + '/as', {});
        },
    };
});


pupinoReports.factory('BuildsFacade', function() {
    /**
     * Constructor
     */
    function BuildsFacade(report) {
        this.builds = report;
        //get the report of the last build finished
        var i = 0;

        while (i <= (this.builds.length - 1) && this.builds[i].result === "BUILDING") {
            this.buildingBuild = report[i];
            i++;
        }

        this.lastBuild = report[i];
        this.features = eval(report[i].features);
        this.passed = 0;
        this.failed = 0;
        this.totalScenarios = 0;

        //remove the last build
        this.builds.splice(i, 1);
    }

    /**
     * Public method, assigned to prototype
     */

    BuildsFacade.prototype.processReport = function(summary, faillingFeatures, passingFeatures) {
        var totalScenarios = 0;
        var passed = 0;
        var failed = 0;

        angular.forEach(this.features, function(elem) {

            passed += elem.numberOfScenariosPassed;
            failed += elem.numberOfScenariosFailed;
            totalScenarios += elem.numberOfScenarios;

            if (elem.status === "FAILED")
                faillingFeatures.push(elem);
            else
                passingFeatures.push(elem);

        })

        summary.totalScenarios = totalScenarios;
        summary.failed = failed;
        summary.passed = passed;

    };


    BuildsFacade.prototype.getSummary = function() {
        var passingScenarios = [];
        var faillingScenarios = [];

        angular.forEach(this.builds, function(elem) {
            console.log(elem.summary)
            passingScenarios.push([elem.number, elem.summary.passingScenarios]);
            faillingScenarios.push([elem.number, elem.summary.faillingScenarios]);
        })

        return {
            passingScenarios: passingScenarios,
            faillingScenarios: faillingScenarios
        }
    };
    /**
     * Return the constructor function
     */
    return BuildsFacade;
});


pupinoReports.factory('BuildFacade', function() {
    /**
     * Constructor
     */
    function BuildFacade(data) {
        this.build = data;
        this.feature = data.features[0];
        var elements = this.processBuild();
        this.background = elements.background;
        this.scenarios = elements.scenarios;
        this.faillingScenarios = elements.faillingScenarios;
    }

    /**
     * Public method, assigned to prototype
     */

    BuildFacade.prototype.processBuild = function() {
        var r = true;
        var background = {};
        var scenarios = [];
        var faillingScenarios = [];
        angular.forEach(this.feature.elements, function(elem) {
            if (elem.keyword === "Background" && r === true) {
                background = elem;
                r = false;
            } else if (elem.keyword !== "Background") {
                if (elem.status === "FAILED") {
                    faillingScenarios.push(elem)
                }
                scenarios.push(elem);
            }
        });

        return {
            background: background,
            scenarios: scenarios,
            faillingScenarios: faillingScenarios
        }
    };

    /**
     * Return the constructor function
     */
    return BuildFacade;
});
