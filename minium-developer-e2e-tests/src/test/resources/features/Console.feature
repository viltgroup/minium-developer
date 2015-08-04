Feature: Test Console log

  Background: 
    Given I'm at Minium Developer
    And the console is visible

  Scenario: Hide console
    When I hide the console
    Then I should not see the console

  Scenario: Test cookies for show and hide console
    When I hide the console
    When I refresh the page
    Then I should not see the console
