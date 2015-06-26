Feature: Evaluate expressions

  Background: 
    Given I am at editor

  Scenario: Clean the scope
    When I evaluate the expression "var a = 10;"
    And I clean the scope
    Then I should see a success notification with text "Preferences updated with success"
