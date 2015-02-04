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
            },
            TEST: {
                FAILING: "Test didn't pass!!",
                PASS: "Test Pass with Sucess",
                NOT_EXECUTED: "No tests executed",
                EXECUTED_PASSED: "Test Executed and Pass"
            },
            SUCCESS_MSG: {
                PREFERENCES: "Preferences updated with success"
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
