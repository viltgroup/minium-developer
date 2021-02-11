'use strict';

angular.module('miniumDeveloper.directives', [])
    .directive('activeMenu', function($translate, $locale, tmhDynamicLocale) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {
                var language = attrs.activeMenu;

                scope.$watch(function() {
                    return $translate.use();
                }, function(selectedLanguage) {
                    if (language === selectedLanguage) {
                        tmhDynamicLocale.set(language);
                        element.addClass('active');
                    } else {
                        element.removeClass('active');
                    }
                });
            }
        };
    })
    .directive('activeLink', function(location) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs, controller) {
                var clazz = attrs.activeLink;
                var path = attrs.href;
                path = path.substring(1); //hack because path does bot return including hashbang
                scope.location = location;
                scope.$watch('location.path()', function(newPath) {
                    if (path === newPath) {
                        element.addClass(clazz);
                    } else {
                        element.removeClass(clazz);
                    }
                });
            }
        };
    })
    .directive('showValidation', function() {
        return {
            restrict: "A",
            require: 'form',
            link: function(scope, element, attrs, formCtrl) {
                element.find('.form-group').each(function() {
                    var $formGroup = $(this);
                    var $inputs = $formGroup.find('input[ng-model],textarea[ng-model],select[ng-model]');

                    if ($inputs.length > 0) {
                        $inputs.each(function() {
                            var $input = $(this);
                            scope.$watch(function() {
                                return $input.hasClass('ng-invalid') && $input.hasClass('ng-dirty');
                            }, function(isInvalid) {
                                $formGroup.toggleClass('has-error', isInvalid);
                            });
                        });
                    }
                });
            }
        };
    })

.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
        elm.text(version);
    };
}])

// module for using css-toggle buttons instead of checkboxes
// toggles the class named in button-toggle element if value is checked
.directive('buttonToggle', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function($scope, element, attr, ctrl) {
            var classToToggle = attr.buttonToggle;
            element.bind('click', function() {
                var checked = ctrl.$viewValue;

                $scope.$apply(function(scope) {
                    ctrl.$setViewValue(checked);
                });

            });
            $scope.$watch(attr.ngModel, function(newValue, oldValue) {
                newValue ? element.addClass(classToToggle) : element.removeClass(classToToggle);
            });
        }
    };
})

.directive('radioButtonGroup', function() {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            options: '=',
            id: '=',
            name: '=',
            suffix: '='
        },
        controller: function($scope) {
            $scope.activate = function(option, $event) {
                $scope.model = option[$scope.id];
                // stop the click event to avoid that Bootstrap toggles the "active" class
                if ($event.stopPropagation) {
                    $event.stopPropagation();
                }
                if ($event.preventDefault) {
                    $event.preventDefault();
                }
                $event.cancelBubble = true;
                $event.returnValue = false;
            };

            $scope.isActive = function(option) {
                return option[$scope.id] == $scope.model;
            };

            $scope.getName = function(option) {
                return option[$scope.name];
            }

            $scope.getIcon = function(option) {
                return option['icon'];
            }
        },
        template: "<button type='button' class='btn btn-default' " +
            "ng-class='{active: isActive(option)}'" +
            "ng-repeat='option in options' " +
            "ng-click='activate(option, $event)'><i class='{{getIcon(option)}} gl-lg'></i><br>" +
            "{{getName(option)}} " +
            "</button>"
    };
})

.directive('showTab', function() {
    return {
        link: function(scope, element, attrs) {
            element.click(function(e) {
                e.preventDefault();
                element.tab('show');
            });
        }
    };
})

.directive('buttonsRadio', function() {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            options: '='
        },
        controller: function($scope) {
            $scope.activate = function(option) {
                $scope.model = option;
            };
        },
        template: "<button type='button' class='btn' " +
            "ng-class='{active: option == model}'" +
            "ng-repeat='option in options' " +
            "ng-click='activate(option)'>{{option}} " +
            "</button>"
    };
})

/**
 * Disable the ng-click in the tag <a>
 */
.directive('aDisabled', function() {
    return {
        compile: function(tElement, tAttrs, transclude) {

            //Disable ngClick
            tAttrs["ngClick"] = ("ng-click", "!(" + tAttrs["aDisabled"] + ") && (" + tAttrs["ngClick"] + ")");

            //Toggle "disabled" to class when aDisabled becomes true
            return function(scope, iElement, iAttrs) {
                scope.$watch(iAttrs["aDisabled"], function(newValue) {
                    if (newValue !== undefined) {
                        iElement.toggleClass("disabled", newValue);
                    }
                });

                //Disable href on click
                iElement.on("click", function(e) {
                    if (scope.$eval(iAttrs["aDisabled"])) {
                        e.preventDefault();
                    }
                });
            };
        }
    };
})

/**
 * To go to a state without notify
 * On open a modal with ui-sref the
 * parent state reload. With this we
 * can avoid that
 **/
.directive('modal', function($state) {
    return {
        restrict: 'A',
        scope: {
            state: '@'
        },
        link: function(scope, element, attrs) {
            var state = attrs.state;
            $(element).click(function(e) {
                $state.go(state, {}, {
                    notify: false,
                });
            });

        }
    };
})

.directive('sidebarToggle', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attr, ctrl) {
            var classToToggle = attr.sideBarToggle;
            element.bind('click', function(e) {
                e.preventDefault();
                if ($(window).width() > 750) {
                    $("body").toggleClass('sidebar-collapse');
                }
                //Handle sidebar push menu for small screens
                else {
                    if ($("body").hasClass('sidebar-open')) {
                        $("body").removeClass('sidebar-open');
                        $("body").removeClass('sidebar-collapse')
                    } else {
                        $("body").addClass('sidebar-open');
                    }
                }


                $(".content-wrapper").click(function() {
                    //Enable hide menu when clicking on the content-wrapper on small screens
                    if ($(window).width() <= 750 && $("body").hasClass("sidebar-open")) {
                        $("body").removeClass('sidebar-open');
                    }
                });

            });

        }
    };
})

.directive('iconItem', function($compile) {

        var statuses = {
            passed: 'PASSED',
            failed: 'FAILED',
            undefined: 'UNDEFINED',
            skipped: 'SKIPPED'
        };

        var successTemplate = '<i class="success fa fa-check-square "></i>';
        var errorTemplate = '<i class="danger fa fa-bug "></i>';
        var undefinedTemplate = '<i class="warning2 fa fa-exclamation-circle "></i>';
        var skipped = '<i class="warning fa  fa-exclamation-triangle "></i>';

        var getStepResult = function(status) {
            var template = '';
            switch (status) {
                case statuses.passed:
                    template = successTemplate;
                    break;
                case statuses.failed:
                    template = errorTemplate;
                    break;
                case statuses.skipped:
                    template = skipped;
                    break;
                case statuses.undefined:
                    template = undefinedTemplate;
                    break;
            }

            return template;
        }

        var linker = function(scope, element, attrs) {
            element.html(getStepResult(scope.status)).show();
            $compile(element.contents())(scope);
        }

        return {
            restrict: "E",
            link: linker,
            scope: {
                status: '='
            }
        };
    })
    .directive("pause", function() {
        return {
            restrict: "A",
            scope: {
                active: "=",
                action: "&"
            },
            link: function(scope, elem, attr) {
                elem.bind("click", function() {
                    if ($(this).hasClass('active')) {
                        scope.active = true;
                        $(this).removeClass("active");
                        $(this).html('<span class="glyphicon glyphicon-play"></span>Play');
                        scope.$apply(scope.active);
                    } else {
                        scope.active = false;
                        scope.$apply(scope.active);
                        scope.$apply(scope.action);
                        $(this).html('<span class="glyphicon glyphicon-pause"></span>Pause');
                        $(this).addClass("active");
                    }

                });
            }
        }
    })
    // https://stackoverflow.com/a/29010910
    .directive("hideIfRemote", function(ngIfDirective) {
        var ngIf = ngIfDirective[0];
        return {
            transclude: ngIf.transclude,
            priority: ngIf.priority - 1,
            terminal: ngIf.terminal,
            restrict: ngIf.restrict,
            link: function(scope, elem, attr) {
                attr.ngIf = function () {
                    // hasRemoteProfile is defined at app.js at root scope
                    // At the editors.html, we use the ng-hide="hasRemoteProfile" because the
                    // element #runningTest cannot be removed from DOM
                    return !scope.hasRemoteProfile;
                }
                ngIf.link.apply(ngIf, arguments);
            }
        }
    });
