Feature: Launch browser

  Background: 
    Given I'm at Minium Developer

  Scenario: Launch Browser
    When I click on toolbar "Run > Launch Browser"
    Then I can see all the available browsers
    When I choose the browser "Chrome"
    Then I should see a new browser window

  Scenario: I should see 3 browsers at minium
    When I click on toolbar "Run > Launch Browser"
    Then I should see at minimum 3 webdrivers availables

  Scenario: Test invalid JSON
    When I click on toolbar "Run > Launch Browser"
    And I click on button "Use remote webdriver"
    And I click on button "Advanced"
    And I fill the field JSON fied with
      """
        {
        url: "url",
        name:"browser",
        etc:"etc" 
        }
      """
    Then I should see message "Invalid JSON"

  Scenario: Test valid JSON
    When I click on toolbar "Run > Launch Browser"
    And I click on button "Use remote webdriver"
    And I click on button "Advanced"
    And I fill the field JSON fied with
      """
      {
      "url": "url",
      "name":"browser",
      "etc":"etc" 
      }
      """
    Then I should see message "Valid JSON"
