(function() {
    var config_data = {
        GENERAL_CONFIG: {
            MSG: {
                TEST_STARTED: "Test Started...",
            },
            ERROR_MSG: {
                TEST_EXECUTING: "A test is already running!!",
                FILE_NOT_FOUND: 'The file was not found!!',
                TEST_ERROR: "Oops, something went wrong.",
                SOCKET_CONNECT: "It was not possible to connect to the socket!!",
                NO_PROJECT_DEFINED: "No project defined!! Please define a project!"
            },
            TEST: {
                FAILING: "Test didn't pass!!",
                PASS: "Test Pass with Sucess",
                NOT_EXECUTED: "No tests executed",
                EXECUTED_PASSED: "Test Executed and Pass"
            },
            SUCCESS_MSG: {
                PREFERENCES: "Preferences updated with success",
                BREAKPOINTS_CLEARED: "Markers cleared"
            },
            UNSAVED_MSG: 'If you leave this page you are going to lose all unsaved changes, are you sure you want to leave?',
            WEBDRIVER: {
                NOTLAUNCHED: 'No web driver launched. Please select one!'
            },
            FILE_SYSTEM: {
                DELETE: 'Are you sure you want to delete this item?'
            },
            POPOVER:{
                DIRECTORY_INPUT: "Put the parent path where you want to create the project!"
            }
        },
        THEMES: {
            BRIGHT: {
                'Chrome': "ace/theme/chrome",
                'Clouds': "ace/theme/clouds",
                'Crimson': "ace/theme/crimson_editor",
                'Dawn': "ace/theme/dawn",
                'Dreamweaver': "ace/theme/dreamweaver",
                'Eclipse': "ace/theme/eclipse",
                'Github': "ace/theme/github",
                'Solarized light': "ace/theme/solarized_light",
                'Textmate': "ace/theme/textmate",
                'Tomorro': "ace/theme/tomorrow",
                'Xcode': "ace/theme/xcode",
            },
            DARK: {
                'Ambiance': "ace/theme/ambiance",
                'Chaos': "ace/theme/chaos",
                'Clouds midnight': "ace/theme/clouds_midnight",
                'Cobalt': "ace/theme/cobalt",
                'Idle_fingers': "ace/theme/idle_fingers",
                'Kr theme': "ace/theme/kr_theme",
                'Merbivore': "ace/theme/merbivore",
                'Mono industrial': "ace/theme/mono_industrial",
                'Mono industrial': "ace/theme/mono_industrial",
                'Monokai': "ace/theme/monokai",
                'Pastel on dark': "ace/theme/pastel_on_dark",
                'Solarized dark': "ace/theme/solarized_dark",
                'Terminal': "ace/theme/terminal",
                'Tomorrow night': "ace/theme/tomorrow_night",
                'Tomorrow night blue': "ace/theme/tomorrow_night_blue",
                'Tomorrow night bright': "ace/theme/tomorrow_night_bright",
                'Tomorrow night eighties': "ace/theme/tomorrow_night_eighties",
                'Twilight': "ace/theme/twilight",
                'Vibrant': "ace/theme/vibrant_ink",
            }
        }
    }

    /* set settings */
    config_module = angular.module('miniumDeveloper.config', []);

    angular.forEach(config_data, function(key, value) {
        config_module.constant(value, key);
    });

}());
