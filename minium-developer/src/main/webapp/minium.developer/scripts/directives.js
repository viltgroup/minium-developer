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

.directive('iconItem', function($compile) {

    var statuses = {
        passed: 'PASSED',
        failed: 'FAILED',
        undefined: 'UNDEFINED',
        skipped: 'SKIPPED'
    };


    var successTemplate = '<i class="success fa fa-check-square "></i>';
    var errorTemplate = '<i class="danger fa fa-bug "></i>';
    var undefinedTemplate = '<i class="warning fa fa-exclamation-triangle "></i>';

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
                template = undefinedTemplate;
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

.directive('abnTree', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'E',
            template: "{html}",
            replace: true,
            scope: {
                treeData: '=',
                onSelect: '&',
                initialSelection: '@',
                treeControl: '='
            },
            link: function(scope, element, attrs) {
                var error, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, get_parent, n, on_treeData_change, select_branch, selected_branch, tree;
                error = function(s) {
                    console.log('ERROR:' + s);
                    debugger;
                    return void 0;
                };
                if (attrs.iconExpand == null) {
                    attrs.iconExpand = 'icon-plus  glyphicon glyphicon-plus  fa fa-plus';
                }
                if (attrs.iconCollapse == null) {
                    attrs.iconCollapse = 'icon-minus glyphicon glyphicon-minus fa fa-minus';
                }
                if (attrs.iconLeaf == null) {
                    attrs.iconLeaf = 'icon-file  glyphicon glyphicon-file  fa fa-file';
                }
                if (attrs.expandLevel == null) {
                    attrs.expandLevel = '3';
                }
                expand_level = parseInt(attrs.expandLevel, 10);
                if (!scope.treeData) {
                    alert('no treeData defined for the tree!');
                    return;
                }
                if (scope.treeData.length == null) {
                    if (treeData.label != null) {
                        scope.treeData = [treeData];
                    } else {
                        alert('treeData should be an array of root branches');
                        return;
                    }
                }
                for_each_branch = function(f) {
                    var do_f, root_branch, _i, _len, _ref, _results;
                    do_f = function(branch, level) {
                        var child, _i, _len, _ref, _results;
                        f(branch, level);
                        if (branch.children != null) {
                            _ref = branch.children;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                child = _ref[_i];
                                _results.push(do_f(child, level + 1));
                            }
                            return _results;
                        }
                    };
                    _ref = scope.treeData;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        root_branch = _ref[_i];
                        _results.push(do_f(root_branch, 1));
                    }
                    return _results;
                };
                selected_branch = null;
                select_branch = function(branch) {
                    if (!branch) {
                        if (selected_branch != null) {
                            selected_branch.selected = false;
                        }
                        selected_branch = null;
                        return;
                    }
                    if (branch !== selected_branch) {
                        if (selected_branch != null) {
                            selected_branch.selected = false;
                        }
                        branch.selected = true;
                        selected_branch = branch;
                        expand_all_parents(branch);
                        if (branch.onSelect != null) {
                            return $timeout(function() {
                                return branch.onSelect(branch);
                            });
                        } else {
                            if (scope.onSelect != null) {
                                return $timeout(function() {
                                    return scope.onSelect({
                                        branch: branch
                                    });
                                });
                            }
                        }
                    }
                };
                scope.user_clicks_branch = function(branch) {
                    if (branch !== selected_branch) {
                        return select_branch(branch);
                    }
                };
                get_parent = function(child) {
                    var parent;
                    parent = void 0;
                    if (child.parent_uid) {
                        for_each_branch(function(b) {
                            if (b.uid === child.parent_uid) {
                                return parent = b;
                            }
                        });
                    }
                    return parent;
                };
                for_all_ancestors = function(child, fn) {
                    var parent;
                    parent = get_parent(child);
                    if (parent != null) {
                        fn(parent);
                        return for_all_ancestors(parent, fn);
                    }
                };
                expand_all_parents = function(child) {
                    return for_all_ancestors(child, function(b) {
                        return b.expanded = true;
                    });
                };
                scope.tree_rows = [];
                on_treeData_change = function() {
                    var add_branch_to_list, root_branch, _i, _len, _ref, _results;
                    for_each_branch(function(b, level) {
                        if (!b.uid) {
                            return b.uid = "" + Math.random();
                        }
                    });
                    console.log('UIDs are set.');
                    for_each_branch(function(b) {
                        var child, _i, _len, _ref, _results;
                        if (angular.isArray(b.children)) {
                            _ref = b.children;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                child = _ref[_i];
                                _results.push(child.parent_uid = b.uid);
                            }
                            return _results;
                        }
                    });
                    scope.tree_rows = [];
                    for_each_branch(function(branch) {
                        var child, f;
                        if (branch.children) {
                            if (branch.children.length > 0) {
                                f = function(e) {
                                    if (typeof e === 'string') {
                                        return {
                                            label: e,
                                            children: []
                                        };
                                    } else {
                                        return e;
                                    }
                                };
                                return branch.children = (function() {
                                    var _i, _len, _ref, _results;
                                    _ref = branch.children;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        _results.push(f(child));
                                    }
                                    return _results;
                                })();
                            }
                        } else {
                            return branch.children = [];
                        }
                    });
                    add_branch_to_list = function(level, branch, visible) {
                        var child, child_visible, tree_icon, _i, _len, _ref, _results;
                        if (branch.expanded == null) {
                            branch.expanded = false;
                        }
                        if (!branch.children || branch.children.length === 0) {
                            tree_icon = attrs.iconLeaf;
                        } else {
                            if (branch.expanded) {
                                tree_icon = attrs.iconCollapse;
                            } else {
                                tree_icon = attrs.iconExpand;
                            }
                        }
                        scope.tree_rows.push({
                            level: level,
                            branch: branch,
                            label: branch.label,
                            tree_icon: tree_icon,
                            visible: visible
                        });
                        if (branch.children != null) {
                            _ref = branch.children;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                child = _ref[_i];
                                child_visible = visible && branch.expanded;
                                _results.push(add_branch_to_list(level + 1, child, child_visible));
                            }
                            return _results;
                        }
                    };
                    _ref = scope.treeData;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        root_branch = _ref[_i];
                        _results.push(add_branch_to_list(1, root_branch, true));
                    }
                    return _results;
                };
                scope.$watch('treeData', on_treeData_change, true);
                if (attrs.initialSelection != null) {
                    for_each_branch(function(b) {
                        if (b.label === attrs.initialSelection) {
                            return $timeout(function() {
                                return select_branch(b);
                            });
                        }
                    });
                }
                n = scope.treeData.length;
                console.log('num root branches = ' + n);
                for_each_branch(function(b, level) {
                    b.level = level;
                    return b.expanded = b.level < expand_level;
                });
                if (scope.treeControl != null) {
                    if (angular.isObject(scope.treeControl)) {
                        tree = scope.treeControl;
                        tree.expand_all = function() {
                            return for_each_branch(function(b, level) {
                                return b.expanded = true;
                            });
                        };
                        tree.collapse_all = function() {
                            return for_each_branch(function(b, level) {
                                return b.expanded = false;
                            });
                        };
                        tree.get_first_branch = function() {
                            n = scope.treeData.length;
                            if (n > 0) {
                                return scope.treeData[0];
                            }
                        };
                        tree.select_first_branch = function() {
                            var b;
                            b = tree.get_first_branch();
                            return tree.select_branch(b);
                        };
                        tree.get_selected_branch = function() {
                            return selected_branch;
                        };
                        tree.get_parent_branch = function(b) {
                            return get_parent(b);
                        };
                        tree.select_branch = function(b) {
                            select_branch(b);
                            return b;
                        };
                        tree.get_children = function(b) {
                            return b.children;
                        };
                        tree.select_parent_branch = function(b) {
                            var p;
                            if (b == null) {
                                b = tree.get_selected_branch();
                            }
                            if (b != null) {
                                p = tree.get_parent_branch(b);
                                if (p != null) {
                                    tree.select_branch(p);
                                    return p;
                                }
                            }
                        };
                        tree.add_branch = function(parent, new_branch) {
                            if (parent != null) {
                                parent.children.push(new_branch);
                                parent.expanded = true;
                            } else {
                                scope.treeData.push(new_branch);
                            }
                            return new_branch;
                        };
                        tree.add_root_branch = function(new_branch) {
                            tree.add_branch(null, new_branch);
                            return new_branch;
                        };
                        tree.expand_branch = function(b) {
                            if (b == null) {
                                b = tree.get_selected_branch();
                            }
                            if (b != null) {
                                b.expanded = true;
                                return b;
                            }
                        };
                        tree.collapse_branch = function(b) {
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                b.expanded = false;
                                return b;
                            }
                        };
                        tree.get_siblings = function(b) {
                            var p, siblings;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                p = tree.get_parent_branch(b);
                                if (p) {
                                    siblings = p.children;
                                } else {
                                    siblings = scope.treeData;
                                }
                                return siblings;
                            }
                        };
                        tree.get_next_sibling = function(b) {
                            var i, siblings;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                siblings = tree.get_siblings(b);
                                n = siblings.length;
                                i = siblings.indexOf(b);
                                if (i < n) {
                                    return siblings[i + 1];
                                }
                            }
                        };
                        tree.get_prev_sibling = function(b) {
                            var i, siblings;
                            if (b == null) {
                                b = selected_branch;
                            }
                            siblings = tree.get_siblings(b);
                            n = siblings.length;
                            i = siblings.indexOf(b);
                            if (i > 0) {
                                return siblings[i - 1];
                            }
                        };
                        tree.select_next_sibling = function(b) {
                            var next;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                next = tree.get_next_sibling(b);
                                if (next != null) {
                                    return tree.select_branch(next);
                                }
                            }
                        };
                        tree.select_prev_sibling = function(b) {
                            var prev;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                prev = tree.get_prev_sibling(b);
                                if (prev != null) {
                                    return tree.select_branch(prev);
                                }
                            }
                        };
                        tree.get_first_child = function(b) {
                            var _ref;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                                    return b.children[0];
                                }
                            }
                        };
                        tree.get_closest_ancestor_next_sibling = function(b) {
                            var next, parent;
                            next = tree.get_next_sibling(b);
                            if (next != null) {
                                return next;
                            } else {
                                parent = tree.get_parent_branch(b);
                                return tree.get_closest_ancestor_next_sibling(parent);
                            }
                        };
                        tree.get_next_branch = function(b) {
                            var next;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                next = tree.get_first_child(b);
                                if (next != null) {
                                    return next;
                                } else {
                                    next = tree.get_closest_ancestor_next_sibling(b);
                                    return next;
                                }
                            }
                        };
                        tree.select_next_branch = function(b) {
                            var next;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                next = tree.get_next_branch(b);
                                if (next != null) {
                                    tree.select_branch(next);
                                    return next;
                                }
                            }
                        };
                        tree.last_descendant = function(b) {
                            var last_child;
                            if (b == null) {
                                debugger;
                            }
                            n = b.children.length;
                            if (n === 0) {
                                return b;
                            } else {
                                last_child = b.children[n - 1];
                                return tree.last_descendant(last_child);
                            }
                        };
                        tree.get_prev_branch = function(b) {
                            var parent, prev_sibling;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                prev_sibling = tree.get_prev_sibling(b);
                                if (prev_sibling != null) {
                                    return tree.last_descendant(prev_sibling);
                                } else {
                                    parent = tree.get_parent_branch(b);
                                    return parent;
                                }
                            }
                        };
                        return tree.select_prev_branch = function(b) {
                            var prev;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                prev = tree.get_prev_branch(b);
                                if (prev != null) {
                                    tree.select_branch(prev);
                                    return prev;
                                }
                            }
                        };
                    }
                }
            }
        };
    }
]);
