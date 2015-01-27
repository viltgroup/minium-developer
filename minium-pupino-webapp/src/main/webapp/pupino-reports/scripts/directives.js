'use strict';

angular.module('pupinoReports')
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
    }).directive('passwordStrengthBar', function() {
        return {
            replace: true,
            restrict: 'E',
            template: '<div id="strength">' +
                '<small translate="global.messages.validate.newpassword.strength">Password strength:</small>' +
                '<ul id="strengthBar">' +
                '<li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li><li class="point"></li>' +
                '</ul>' +
                '</div>',
            link: function(scope, iElement, attr) {
                var strength = {
                    colors: ['#F00', '#F90', '#FF0', '#9F0', '#0F0'],
                    mesureStrength: function(p) {

                        var _force = 0;
                        var _regex = /[$-/:-?{-~!"^_`\[\]]/g; // "

                        var _lowerLetters = /[a-z]+/.test(p);
                        var _upperLetters = /[A-Z]+/.test(p);
                        var _numbers = /[0-9]+/.test(p);
                        var _symbols = _regex.test(p);

                        var _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];
                        var _passedMatches = $.grep(_flags, function(el) {
                            return el === true;
                        }).length;

                        _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
                        _force += _passedMatches * 10;

                        // penality (short password)
                        _force = (p.length <= 6) ? Math.min(_force, 10) : _force;

                        // penality (poor variety of characters)
                        _force = (_passedMatches == 1) ? Math.min(_force, 10) : _force;
                        _force = (_passedMatches == 2) ? Math.min(_force, 20) : _force;
                        _force = (_passedMatches == 3) ? Math.min(_force, 40) : _force;

                        return _force;

                    },
                    getColor: function(s) {

                        var idx = 0;
                        if (s <= 10) {
                            idx = 0;
                        } else if (s <= 20) {
                            idx = 1;
                        } else if (s <= 30) {
                            idx = 2;
                        } else if (s <= 40) {
                            idx = 3;
                        } else {
                            idx = 4;
                        }

                        return {
                            idx: idx + 1,
                            col: this.colors[idx]
                        };
                    }
                };
                scope.$watch(attr.passwordToCheck, function(password) {
                    if (password) {
                        var c = strength.getColor(strength.mesureStrength(password));
                        iElement.removeClass('ng-hide');
                        iElement.find('ul').children('li')
                            .css({
                                "background": "#DDD"
                            })
                            .slice(0, c.idx)
                            .css({
                                "background": c.col
                            });
                    }
                });
            }
        }
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
                    ctrl.$setViewValue(!checked);
                });
            });

            $scope.$watch(attr.ngModel, function(newValue, oldValue) {
                newValue ? element.addClass(classToToggle) : element.removeClass(classToToggle);
            });
        }
    };
})

.directive('iconItem', function($compile) {

    var successTemplate = '<i class="success fa fa-check-square fa-2x"></i>';
    var errorTemplate = '<i class="danger fa fa-bug fa-2x"></i>';

    var successTemplateForScenario = '<i class="success fa fa-check-square "></i>';
    var errorTemplateForScenario = '<i class="danger fa fa-bug "></i> ';

    var getBuildResult = function(contentType) {
        var template = '';
        switch (contentType) {
            case 'SUCCESS':
                template = successTemplate;
                break;
            default:
                template = errorTemplate;
        }

        return template;
    }

    var getFeatureResult = function(contentType) {
        var template = '';

        switch (contentType) {
            case 'PASSED':
                template = successTemplate;
                break;
            default:
                template = errorTemplate;
        }

        return template;
    }

    var getScenarioResult = function(contentType) {
        var template = '';

        switch (contentType) {
            case 'PASSED':
                template = successTemplateForScenario;
                break;
            default:
                template = errorTemplateForScenario;
        }

        return template;
    }

    var linker = function(scope, element, attrs) {
        if (attrs.type === "build") {
            element.html(getBuildResult(scope.content)).show();
        } else if (attrs.type === "scenario") {
            element.html(getScenarioResult(scope.content)).show();
        } else {
            element.html(getFeatureResult(scope.content)).show();
        }

        $compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        link: linker,
        scope: {
            content: '='
        }
    };
})

.directive('iconItemScenario', function($compile) {

    var successTemplateForScenario = '<i class="success fa fa-check-square "></i>';
    var errorTemplateForScenario = '<i class="danger fa fa-bug "></i> ';

    var statuses = {
        passed: 'PASSED',
        failed: 'FAILED'
    };

    var getScenarioResult = function(scenarioStatus, backgroundStatus) {
        var template = '';
        
        if (passed(scenarioStatus) && passed(backgroundStatus)) {
            template = successTemplateForScenario;
        } else if(passed(scenarioStatus) && (backgroundStatus === undefined) ){
            template = successTemplateForScenario;
        } else{
            template = errorTemplateForScenario;
        }

        return template;
    }

    var passed = function(status) {
        return status === statuses.passed;
    }

    var linker = function(scope, element, attrs) {

        element.html(getScenarioResult(scope.scenarioStatus, scope.backgroundStatus)).show();

        $compile(element.contents())(scope);
    }

    return {
        restrict: "E",
        link: linker,
        scope: {
            scenarioStatus: '=',
            backgroundStatus: '='
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
                if ($(window).width() <= 800) {
                    $('.row-offcanvas').toggleClass('active');
                    $('.left-side').removeClass("collapse-left");
                    $(".right-side").removeClass("strech");
                    $('.row-offcanvas').toggleClass("relative");
                } else {
                    //Else, enable content streching
                    $('.left-side').toggleClass("collapse-left");
                    $(".right-side").toggleClass("strech");
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
            console.debug(path);
            scope.$watch('location.path()', function(newPath) {
                if (path === newPath) {
                    element.addClass(clazz);
                } else {
                    element.removeClass(clazz);
                }
            });
        }
    }
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

/*
    A directive that can easily be used on text areas/fields to 
    automatically truncate/collapse/shrink text to a specific character 
    limit, adding a "show more/less" toggle
 */
.directive('ddCollapseText', ['$compile', function($compile) {
    return {
        restrict: 'A',
        replace: true,
        link: function(scope, element, attrs) {
            // start collapsed
            scope.collapsed = false;

            // create the function to toggle the collapse
            scope.toggle = function() {
                scope.collapsed = !scope.collapsed;
            };

            // get the value of the dd-collapse-text attribute
            attrs.$observe('ddCollapseText', function(maxLength) {
                // get the contents of the element
                var text = element.text();

                if (text.length > maxLength) {
                    // split the text in two parts, the first always showing
                    var firstPart = String(text).substring(0, maxLength);
                    var secondPart = String(text).substring(maxLength, text.length);

                    // create some new html elements to hold the separate info
                    var firstSpan = $compile('<span>' + firstPart + '</span>')(scope);
                    var secondSpan = $compile('<span ng-if="collapsed">' + secondPart + '</span>')(scope);
                    var moreIndicatorSpan = $compile('<span ng-if="!collapsed">...</span>')(scope);
                    var toggleButton = $compile('<span class="collapse-text-toggle" ng-click="toggle()">{{collapsed ? "less" : "more"}}</span>')(scope);

                    // remove the current contents of the element
                    // and add the new ones we created
                    element.empty();
                    element.append(firstSpan);
                    element.append(secondSpan);
                    element.append(moreIndicatorSpan);
                    element.append(toggleButton);
                }
            });
        }
    };
}]);
