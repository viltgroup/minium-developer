Feature: Side Bar features

  Background: 
    Given I am at editor

  Scenario: Test folders order
    Given The side bar is not hiden
    Then I see the folders sorted in alphabetical order

  Scenario: collapse navigation bar
    When I click on the collapse button
    Then The navigation tree bar is colapsed

  Scenario: files order after creating
    Given The folder (or file) "testes > newFile" does not exists
    When I create a new file "testes > newFile"
    Then The folders and files are sorted in alphabetical order

  Scenario: files order after creating and refresh
    Given The folder (or file) "testes > newFile" does not exists
    When I create a new file "testes > newFile"
    And I refresh
    Then The folders and files are sorted in alphabetical order

  Scenario: refresh navigation bar
    When I refresh the navigation bar
    Then The navigation tree bar is colapsed
