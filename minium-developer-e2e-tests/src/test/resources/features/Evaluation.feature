Feature: Evaluate expressions

  Background: 
    Given I am at editor
    And a browser is already launched

  Scenario: Clean the scope
    When I evaluate the expression "var a = 10;"
    And I click on toolbar "Run > Clean Scope"
    Then I should see a success notification with text "evaluator.clean.success"
