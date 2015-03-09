Feature: Side Bar features

  Background: 
    Given I am at editor

  Scenario: Test Menus
    Given The side bar is not hiden
    Then I see the folders sorted in alphabetical order

  Scenario: Little description here
    When I click on the collapse button
    Then The navigation tree bar is colapsed

  Scenario: refresh
    When I refresh the navigation bar
    Then The navigation tree bar is colapsed
