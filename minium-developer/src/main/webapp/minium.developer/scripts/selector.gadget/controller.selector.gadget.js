'use strict';

//
//SelectorGadgetCtrl
//
angular.module('minium.developer')
    .controller('SelectorGadgetCtrl', function($rootScope, $scope, $location, $modalInstance, SelectorGadgetService, editor) {

    var request = SelectorGadgetService.activate()
        .success(function() {
            toastr.success("Selector Gadget activated");
        })
        .error(function() {
            toastr.warning("Selector Gadget failed");
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

                    toastr.success("Picked CSS selector is " + data + "!");
                } else {
                    // close modal
                    $modalInstance.dismiss('cancel');

                    toastr.warning("No element was picked");
                }
            })
            .error(function() {
                toastr.warning("Could not pick element");
            });
    };

    $scope.cancel = function() {
        var request = SelectorGadgetService.deactivate()
            .success(function(data) {
                // close modal
            })
            .error(function() {
                toastr.warning("Could not deactivate selector gadget");
            });
        $modalInstance.dismiss('cancel');
    };
});