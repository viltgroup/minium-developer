var pupinoReports = angular.module('pupinoReports', [
    'http-auth-interceptor',
    'tmh.dynamicLocale',
    'ngResource',
    'ngRoute',
    'ngCookies',
    'pupinoReportsUtils',
    'pascalprecht.translate',
    'truncate',
    'ui.router',
    'ui.ace',
    'ui.bootstrap',
    'ui.bootstrap.showErrors',
    'nvd3ChartDirectives',
    'pasvaz.bindonce',
    'pupinoReports.controllers',
    'pupinoReports.filters'
])

.config(function($httpProvider, $urlRouterProvider, $stateProvider, $translateProvider, tmhDynamicLocaleProvider, USER_ROLES) {


    $urlRouterProvider
        .when("", "/project")
        .otherwise("/project");

    $stateProvider
        .state('global.bugtracker', {
            url: "/bugtracker",
            templateUrl: "pupino-reports/views/bug-tracker.html",
            controller: "GlobalController"
        })
        .state('global.feature-report', {
            url: "/report/feature/*path",
            templateUrl: "pupino-reports/views/partials/feature-report.html",
            controller: "GlobalController"
        })
        .state('global.report', {
            url: "/report/*path",
            templateUrl: "pupino-reports/views/partials/report.html",
            controller: "ReportController"
        })
        .state('register', {
            url: "/register",
            templateUrl: 'pupino-reports/views/jhipster/register.html',
            controller: 'RegisterController',
            access: {
                authorizedRoles: [USER_ROLES.all]
            }
        })
        .state('activate', {
            url: "/activate",
            templateUrl: 'pupino-reports/views/jhipster/activate.html',
            controller: 'ActivationController',
            access: {
                authorizedRoles: [USER_ROLES.all]
            }
        })
        .state('login', {
            url: "/login",
            templateUrl: 'pupino-reports/views/jhipster/login.html',
            controller: 'LoginController',
            access: {
                authorizedRoles: [USER_ROLES.all]
            }
        })
        .state('global.error', {
            url: "/error",
            templateUrl: 'pupino-reports/views/jhipster/error.html',
            access: {
                authorizedRoles: [USER_ROLES.all]
            }
        })
        .state('global.settings', {
            url: "/settings",
            templateUrl: 'pupino-reports/views/jhipster/settings.html',
            controller: 'SettingsController',
            access: {
                authorizedRoles: [USER_ROLES.user]
            }
        })
        .state('global.password', {
            url: "/password",
            templateUrl: 'pupino-reports/views/jhipster/password.html',
            controller: 'PasswordController',
            access: {
                authorizedRoles: [USER_ROLES.user]
            }
        })
        .state('global.sessions', {
            url: "/sessions",
            templateUrl: 'pupino-reports/views/jhipster/sessions.html',
            controller: 'SessionsController',
            resolve: {
                resolvedSessions: ['Sessions', function(Sessions) {
                    return Sessions.get();
                }]
            },
            access: {
                authorizedRoles: [USER_ROLES.user]
            }
        })
        .state('global.metrics', {
            url: "/metrics",
            templateUrl: 'pupino-reports/views/jhipster/metrics.html',
            controller: 'MetricsController',
            access: {
                authorizedRoles: [USER_ROLES.admin]
            }
        })
        .state('global.health', {
            url: "/health",
            templateUrl: 'pupino-reports/views/jhipster/health.html',
            controller: 'HealthController',
            access: {
                authorizedRoles: [USER_ROLES.admin]
            }
        })
        .state('global.logs', {
            url: "/logs",
            templateUrl: 'pupino-reports/views/jhipster/logs.html',
            controller: 'LogsController',
            resolve: {
                resolvedLogs: ['LogsService', function(LogsService) {
                    return LogsService.findAll();
                }]
            },
            access: {
                authorizedRoles: [USER_ROLES.admin]
            }
        })
        .state('global.audits', {
            url: "/audits",
            templateUrl: 'pupino-reports/views/jhipster/audits.html',
            controller: 'AuditsController',
            access: {
                authorizedRoles: [USER_ROLES.admin]
            }
        })
        .state('global.logout', {
            url: "/logout",
            templateUrl: 'pupino-reports/views/jhipster/main.html',
            controller: 'LogoutController',
            access: {
                authorizedRoles: [USER_ROLES.all]
            }
        })
        .state('global.docs', {
            url: "/docs",
            templateUrl: 'pupino-reports/views/jhipster/docs.html',
            access: {
                authorizedRoles: [USER_ROLES.admin]
            }
        });

    // Initialize angular-translate
    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');

    $translateProvider.useCookieStorage();

    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js')
    tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');
})

.run(function($rootScope, $location, $http, AuthenticationSharedService, Session, USER_ROLES) {
    $rootScope.authenticated = false;
    $rootScope.$on('$routeChangeStart', function(event, next) {
        $rootScope.isAuthorized = AuthenticationSharedService.isAuthorized;
        $rootScope.userRoles = USER_ROLES;
        AuthenticationSharedService.valid(next.access.authorizedRoles);
    });

    // Call when the the client is confirmed
    $rootScope.$on('event:auth-loginConfirmed', function(data) {
        $rootScope.authenticated = true;
        if ($location.path() === "/login") {
            var search = $location.search();
            if (search.redirect !== undefined) {
                $location.path(search.redirect).search('redirect', null).replace();
            } else {
                $location.path('/').replace();
            }
        }
    });

    // Call when the 401 response is returned by the server
    $rootScope.$on('event:auth-loginRequired', function(rejection) {
        Session.invalidate();
        $rootScope.authenticated = false;
        if ($location.path() !== "/" && $location.path() !== "" && $location.path() !== "/register" &&
            $location.path() !== "/activate" && $location.path() !== "/login") {
            var redirect = $location.path();
            $location.path('/login').search('redirect', redirect).replace();
        }
    });

    // Call when the 403 response is returned by the server
    $rootScope.$on('event:auth-notAuthorized', function(rejection) {
        $rootScope.errorMessage = 'errors.403';
        $location.path('/error').replace();
    });

    // Call when the user logs out
    $rootScope.$on('event:auth-loginCancelled', function() {
        $location.path('');
    });
});
