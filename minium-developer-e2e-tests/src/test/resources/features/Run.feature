Feature: Run features

  Background: 
    Given I'm at Minium Developer
    And the active project is "minium-cucumber-test"
    And a browser is already launched

  Scenario: Run all tests (button 'Run Test', first line selected)
    When I open file "minium-cucumber-test/features/my-feature.feature"
    And I click on button "Run Test"
    Then I should see a success notification with text "Test Started..."

  Scenario: Run all tests (button 'Run All')
    When I open file "minium-cucumber-test/features/my-feature.feature"
    And I click on button "Run All"
    Then I should see a success notification with text "Test Started..."

  Scenario: Run one test (button 'Run Test')
    When I open file "minium-cucumber-test/features/my-feature.feature"
    And I set the cursor at line 5
    And I click on button "Run Test"
    Then I should see a success notification with text "Test Started..."
    And I should see a success notification with text "Test Pass with Sucess"

  Scenario: Run one test (button 'Run Test')
    When I open file "minium-cucumber-test/features/my-feature.feature"
    And I select the scenario number 3 in the feature "teste.feature"
    And I go to the tab "teste.feature"
    And I click on button "Run Test"
    Then I should see a success notification with text "Test Started..."
    Then I should see a warning notification with text "Test didn't pass!!"

  Scenario: Launch Browser
    When I click on toolbar "Other actions > Launch Browser"
    Then I can see all the available browsers
    When I choose the browser "Chrome"
    Then I should see a new browser window
