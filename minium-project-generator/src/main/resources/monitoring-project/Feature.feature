Feature: Monitor Performance

  Scenario: Check minium.vilt.io
    When Check if that the domain responds: "https://minium.vilt.io/"

  Scenario: Print information about github.com
    When Check if that the domain responds: "https://github.com/viltgroup/minium/"
    And I print the performance of the current website

  Scenario: Append performance to report
    When Check if that the domain responds: "https://www.vilt-group.com/en/"
    And I append the performance data to the report

  Scenario: Check if the site loads quickly
    When Check if that the domain responds: "https://www.seleniumhq.org/"
    Then The current page loads in less than the threshold

  Scenario Outline: Search something in google (results in a JSON file)
    Given Check if that the domain responds: "http://www.google.com/ncr"
    When I search for "<search_query>"
    Then links corresponding to "<search_query>" are displayed
    And I print the performance of the current website

    Examples: 
      | search_query  |
      | Minium Github |
      | Selenium      |
