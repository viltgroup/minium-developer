Feature: Launch browser

  Background: 
    Given I'm at Minium Developer
    And no browser is launched

  Scenario: Launch Browser
    When I click on toolbar "Other actions > Launch Browser"
    Then I can see all the available browsers
    When I choose the browser "Chrome"
    Then I should see a new browser window
