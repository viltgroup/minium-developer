@runit
Feature: Run features

  Background: 
    Given I'm at Minium Developer
    And the following project is active:
      | Project type | Cucumber project     |
      | Project Name | minium-cucumber-test |
      | Group ID     | io.vilt.minium.test  |
      | Version      | 1.0.5-SNAPSHOT       |
      | Feature file | my-feature           |
      | Step file    | my-steps             |
    And a browser is already launched

  Scenario: Run all tests (button 'Run Test', first line selected)
    When I open file "minium-cucumber-test/features/my-feature.feature"
    And I click on button "Run Test"
    Then I should see a success notification with text "Test Started..."
    When I wait until the test is completed
    And I should see a success notification with text "Test Pass with Sucess"
    And only lines 6,7,8,11,12,13 should be marked as passed

  Scenario: Run all tests (button 'Run All')
    When I open file "minium-cucumber-test/features/my-feature.feature"
    And I click on button "Run All"
    Then I should see a success notification with text "Test Started..."
    When I wait until the test is completed
    And I should see a success notification with text "Test Pass with Sucess"
    And only lines 6,7,8,11,12,13 should be marked as passed

  Scenario: Run one test (button 'Run Test')
    When I open file "minium-cucumber-test/features/my-feature.feature"
    And I move the cursor to line 5
    And I click on button "Run Test"
    And I wait until the test is completed
    And I should see a success notification with text "Test Pass with Sucess"
    And only lines 6,7,8 should be marked as passed

  Scenario: Run one scenario outline example test (button 'Run Test')
    When I open file "minium-cucumber-test/features/my-feature.feature"
    And I move the cursor to line 17
    And I click on button "Run Test"
    And I wait until the test is completed
    And I should see a success notification with text "Test Pass with Sucess"
    And only lines 11,12,13 should be marked as passed
