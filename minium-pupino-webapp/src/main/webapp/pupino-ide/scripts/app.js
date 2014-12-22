'use strict';

/* App Module */

var pupinoIDE = angular.module('pupinoIDE', [
    'tmh.dynamicLocale',
    'ngResource',
    'ngRoute',
    'ngCookies',
    'pascalprecht.translate',
    'truncate',
    'ui.router',
    'ui.ace',
    'ui.bootstrap',
    'ui.bootstrap.showErrors',
    'angularTreeview',
    'pasvaz.bindonce',
    'pupinoIDE.filters',
    'pupinoIDE.directives'
]);

pupinoIDE
    .provider('modalState', function($stateProvider) {
        var provider = this;
        this.$get = function() {
            return provider;
        }
        this.state = function(stateName, options) {
            var modalInstance;
            $stateProvider.state(stateName, {
                url: options.url,
                onEnter: function($modal, $state) {

                    modalInstance = $modal.open(options);
                    modalInstance.result['finally'](function() {
                        modalInstance = null;
                        if ($state.$current.name === stateName) {
                            $state.go('^');
                        }
                    });
                },
                onExit: function() {
                    if (modalInstance) {
                        modalInstance.close();
                    }
                }
            });
        };
    })

.config(function( $httpProvider, $urlRouterProvider, $stateProvider, modalStateProvider, $translateProvider, tmhDynamicLocaleProvider) {

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