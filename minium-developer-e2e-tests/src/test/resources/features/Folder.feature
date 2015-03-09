Feature: Folders features

  Scenario: create new folder
    Given The folder (or file) "testes > newFolder" does not exists
    When I create a new folder "testes > newFolder"
    Then I should see the folder "testes > newFolder" in the navigation tree

  Scenario: delete folder
    Given Exists a folder "testes > newFolder"
    When I delete the folder "testes > newFolder"
    When I refresh the navigation bar
    When I click on the collapse button
    Then I should not see the folder "testes > newFolder" in the navigation tree

  Scenario: create new file
    Given The file "testes > newFile" does not exists
    When I create a new file "testes > newFile"
    Then I should see the file "testes > newFile" in the navigation tree
