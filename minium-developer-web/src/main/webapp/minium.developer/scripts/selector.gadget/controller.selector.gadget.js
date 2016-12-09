'use strict';

//
//SelectorGadgetCtrl
//
angular.module('minium.developer')
    .controller('SelectorGadgetCtrl', function($rootScope, $scope, $translate, $filter, $location, $modalInstance, SelectorGadgetService, editor) {

        var $translate = $filter('translate');
        var request = SelectorGadgetService.activate()
            .success(function() {
                toastr.success($translate('selector.gadget.activated'));
            })
            .error(function() {
                toastr.warning($translate('selector.gadget.failed'));
            });


        $scope.accept = function() {
            var request = SelectorGadgetService.cssSelector()
                .success(function(data) {
                    if (data.expression) {
                        var session = editor.getSession();
                        var range = editor.getSelectionRange();
                        var position = range.start;
                        session.remove(range);
                        session.insert(position, data.expression);

                        $modalInstance.close(data);
                        toastr.success($translate('selector.gadget.picked', {
                            data: data
                        }));
                    } else {
                        // close modal
                        $modalInstance.dismiss('cancel');
                        toastr.warning($translate('selector.gadget.no_elem'));
                    }
                })
                .error(function() {
                    toastr.warning($translate('selector.gadget.error'));
                    $modalInstance.dismiss('cancel');
                });
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    });
