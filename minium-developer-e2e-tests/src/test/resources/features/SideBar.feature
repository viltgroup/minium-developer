Feature: Test tabs of editor

  Background: 
    Given I am at editor
    And I have opened the following files:
      | features > EditorTabs.features |
      | features > Preferences.feature |
      | steps > steps.js               |

  Scenario: Open a file already open in tabs
    When I open the file "features > EditorTabs.features"
    Then the number of open tabs should be 3

  Scenario: Test url
    When I open the file "steps > editor.tabs.steps.js"
    Then the url should contain "steps/editor.tabs.steps.js"

  Scenario: Change tabs
    When I go to tab "EditorTabs.feature"
    Then the url should contain "features/EditorTabs.feature"
    When I go to tab "Preferences.feature"
    Then the url should contain "features/Preferences.feature"

  Scenario: Check if dirty
    When I go to tab "Preferences.feature"
    And I write in editor "Testing"
    Then the tab should be dirty

  Scenario: Close tab
    When I open the file "steps > editor.tabs.steps.js"
    When I close the tab "editor.tabs.steps.js"
    Then the url shouldn't contain "steps/editor.tabs.steps.js"
