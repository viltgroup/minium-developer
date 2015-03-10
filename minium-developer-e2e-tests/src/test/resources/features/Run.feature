Feature: Run features

  Background: 
    Given I am at editor

  Scenario: Run all tests (button 'Run Test', first line selected)
    When I open the file "testes > teste.feature"
    When I go to the tab "teste.feature"
    And I click on button "Run Test"
    Then I should see a notification with text "Test Started..." and with type "success"

  Scenario: Run all tests (button 'Run All')
    When I open the file "testes > teste.feature"
    When I go to the tab "teste.feature"
    And I click on button "Run All"
    Then I should see a notification with text "Test Started..." and with type "success"

  Scenario: Run one test (button 'Run Test')
    When I open the file "testes > teste.feature"
    And I go to the tab "teste.feature"
    And I select the scenario number 2 in the feature "teste.feature"
    And I click on button "Run Test"
    Then I should see a notification with text "Test Started..." and with type "success"
    And I should see a notification with text "Test Pass with Sucess" and with type "success"

  Scenario: Run one test (button 'Run Test')
    When I open the file "testes > teste.feature"
    And I select the scenario number 3 in the feature "teste.feature"
    And I go to the tab "teste.feature"
    And I click on button "Run Test"
    Then I should see a notification with text "Test Started..." and with type "success"
    Then I should see a notification with text "Test didn't pass!!" and with type "warning"

  Scenario: Launch Browser
    When I click on toolbar "Other actions > Launch Browser"
    Then I can see all the available browsers
    When I choose the browser "Chrome"
    Then I should see a new browser window
