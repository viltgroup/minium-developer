(function() {
    'use strict';

    angular.module('minium.developer')
        .controller('WebDriversDownloadController', WebDriversDownloadController);

    WebDriversDownloadController.$inject = ['$scope', '$translate', '$filter', 'WebDriverFactory'];

    function WebDriversDownloadController($scope, $translate, $filter, WebDriverFactory) {

        var $translate = $filter('translate');

        $scope.downloadAllWebdrivers = function() {
            toastr.info($translate('webdriver.download.started'));
            WebDriverFactory.downloadAll()
                .success(function() {
                    toastr.success($translate('webdriver.download.complete'));
                }).error(function() {
                    toastr.error($translate('webdriver.download.error'));
                });
        }

        $scope.updateAllWebdrivers = function() {
            toastr.info($translate('webdriver.update.started'));
            WebDriverFactory.updateAll()
                .success(function() {
                    toastr.success($translate('webdriver.update.complete'));
                }).error(function() {
                    toastr.error($translate('webdriver.update.error'));
                });
        }
    }

})();
