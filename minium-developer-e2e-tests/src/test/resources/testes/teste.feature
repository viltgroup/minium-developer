Feature: Test Features

  Background: 
    Given I am at editor

  Scenario: collapse navigation bar
    When I click on the collapse button
    Then The navigation tree bar is colapsed

  Scenario: open tab
    When I open the file "testes > teste.js"
    Then I should see the tab "teste.js"

  Scenario: refresh navigation bar
    When I refresh the navigation bar
    Then The navigation tree bar is colapsed

  Scenario: collapse navigation bar
    When I click on the collapse button
    Then The navigation tree bar is colapsed
