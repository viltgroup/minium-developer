Feature: Tab features

  Background: 
    Given I am at editor

  Scenario: open tab
    When I open the file "testes > teste.js"
    Then I should see the tab "teste.js"

  Scenario: close tab
    Given The file "teste.js" is open
    When I close the tab "teste.js"
    Then I should not see the tab "teste.js"

  Scenario: number of open tabs
    Given I have 1 open tabs
    And the file "teste.js" is close
    When I open the file "testes > teste.js"
    Then I should see 2 open tabs

  Scenario: number of tabs after refresh
    Given I have 2 open tabs
    When I refresh
    Then I should see 2 open tabs

  Scenario: dirty files
    When I open the file "testes > teste.js"
    And I add to "teste.js" text "lalalala"
    Then I should have a dirty page
    And I should see the dirty file named "teste.js*"

  Scenario: save file
    Given I have a dirty file "teste.js*"
    When I go to the tab "teste.js"
    And I save the file "teste.js"
    Then I should see the tab "teste.js"

  Scenario: js file buttons
    When I open the file "testes > teste.js"
    Then I should see the buttons for the type "js"

  Scenario: feature file buttons
    When I open the file "testes > teste.feature"
    Then I should see the buttons for the type "feature"

  Scenario: close all tabs
    When I close all tabs
    Then There is only one open tab named 'untitled'
