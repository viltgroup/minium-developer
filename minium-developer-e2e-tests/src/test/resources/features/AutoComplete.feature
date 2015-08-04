@runit
Feature: Autocomplete

  Background: 
    Given I'm at Minium Developer

  Scenario: Test autocomplete is visisble
    When I write the expression "elem.cli"
    Then I shoul see the autocomplete tooltip

  Scenario: Test Minium function in autocomplete
    When I write the expression "elem.fill"
    Then I shoul see the autocomplete tooltip
    And I should see the function "fill(text)" in doc tooltip
