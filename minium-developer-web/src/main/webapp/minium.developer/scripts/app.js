'use strict';

/* App Module */

var miniumDeveloper = angular.module('minium.developer', [
    'tmh.dynamicLocale',
    'ngResource',
    'ngCookies',
    'pascalprecht.translate',
    'ui.router',
    'ui.ace',
    'ui.bootstrap',
    'ui.bootstrap.showErrors',
    'treeControl',
    'nvd3ChartDirectives',
    'miniumDeveloper.filters',
    'miniumDeveloper.directives',
    'miniumDeveloper.config',
    'minium.stacktrace.parser',
    'io.dennis.contextmenu'
]);

miniumDeveloper.provider('modalState', function($stateProvider) {
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
                        $state.go('^', {}, {
                            notify: false,
                        });
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

.config(function($httpProvider, $urlRouterProvider, $stateProvider, modalStateProvider, $translateProvider, tmhDynamicLocaleProvider) {

    // Initialize angular-translate
    $translateProvider.useStaticFilesLoader({
        prefix: 'i18n/',
        suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');

    $translateProvider.useCookieStorage();

    tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js')
    tmhDynamicLocaleProvider.useCookieStorage('NG_TRANSLATE_LANG_KEY');
});
