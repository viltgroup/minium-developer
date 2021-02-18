'use strict';

angular.module('miniumdevApp', [
    'LocalStorageModule',
    'ngCacheBuster',
    'minium.developer'
])

.run(function($rootScope, $location, $http, $state, $translate, $window, Language, ENV, VERSION, ProjectFactory, ProjectService,openTab) {
    $rootScope.ENV = ENV;
    $rootScope.VERSION = VERSION;
    $rootScope.$on('$stateChangeStart', function(event, toState, toStateParams) {
        $rootScope.toState = toState;
        $rootScope.toStateParams = toStateParams;


        // Update the language
        Language.getCurrent().then(function(language) {
            $translate.use(language);
        });
    });

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        $rootScope.previousStateName = fromState.name;
        $rootScope.previousStateParams = fromParams;
    });


    $rootScope.back = function() {
        // If previous state is 'activate' or do not exist go to 'home'
        if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
            $state.go('home');
        } else {
            $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
        }
    };

    // before get in the state
    // check if project is defined
    // hack: to stop a refresh of the page
    // on loading the project from a cookie

    ProjectFactory.hasProject().success(function(data) {
        if ($.cookie('project') != undefined && !(data !== '')) {
            var cookieTabs = openTab.load();
            ProjectService.open($.cookie('project'),cookieTabs);
        }
    });

    // Loads the Profile remote by checking if we are at root context path or not
    // https://stackoverflow.com/a/44664031
    // https://stackoverflow.com/a/8100532
    $rootScope.hasRemoteProfile = $window.location.pathname != '/' ? true : false;
})

.config(function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider, httpRequestInterceptorCacheBusterProvider) {

    //enable CSRF
    $httpProvider.defaults.xsrfCookieName = 'CSRF-TOKEN';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';

    //Cache everything except rest api requests
    httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/], true);

    $urlRouterProvider.otherwise('/editor/');
    $stateProvider.state('global', {
        'abstract': true,
        resolve: {
            translatePartialLoader: ['$translate', '$translatePartialLoader', function($translate, $translatePartialLoader) {
                $translatePartialLoader.addPart('global');
                $translatePartialLoader.addPart('language');
                return $translate.refresh();
            }]
        }
    });


    // Initialize angular-translate
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'i18n/{lang}/{part}.json'
    });

    $translateProvider.preferredLanguage('en');
    $translateProvider.useCookieStorage();

    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
    tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');
});
