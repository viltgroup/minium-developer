Feature: Folders features

  Background: 
    Given I am at editor
    And The side bar is not hiden

  Scenario: create new folder
    Given folder "testes/newFolder" does not exist
    When I create a new folder "testes/newFolder"
    Then I should see the folder (or file) "testes > newFolder" in the navigation tree

  Scenario: delete folder
    Given Exists a folder (or file) "testes > newFolder"
    When I delete the folder "testes > newFolder"
    When I refresh the navigation bar
    When I click on the collapse button
    Then I should not see the folder (or file) "testes > newFolder" in the navigation tree

  Scenario: create new file
    Given The folder (or file) "testes > newFile" does not exists
    When I create a new file "testes > newFile"
    Then I should see the folder (or file) "testes > newFile" in the navigation tree

  Scenario: delete file
    Given Exists a folder (or file) "testes > newFile"
    When I delete the file "testes > newFile"
    Then I should not see the folder (or file) "testes > newFile" in the navigation tree
