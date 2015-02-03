'use strict';

/* App Module */
var miniumComponents = angular.module('minium.components', [])

/*
Languages codes are ISO_639-1 codes, see http://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
They are written in English to avoid character encoding issues (not a perfect solution)
*/
miniumComponents.constant('LANGUAGES', {
    'ca': 'Catalan',
    'zh-tw': 'Chinese (traditional)',
    'da': 'Danish',
    'en': 'English',
    'fr': 'French',
    'de': 'German',
    'kr': 'Korean',
    'pl': 'Polish',
    'pt-br': 'Portuguese (Brazilian)',
    'ru': 'Russian',
    'es': 'Spanish',
    'sv': 'Swedish',
    'tr': 'Turkish'
});

miniumComponents.factory('LanguageService', function($http, $translate, LANGUAGES) {
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

miniumComponents.controller('LanguageController', function($scope, $translate, LanguageService) {
    $scope.changeLanguage = function(languageKey) {
        $translate.use(languageKey);

        LanguageService.getBy(languageKey).then(function(languages) {
            $scope.languages = languages;
        });
    };

    LanguageService.getBy().then(function(languages) {
        $scope.languages = languages;
    });
});
