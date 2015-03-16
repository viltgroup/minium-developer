@runit
Feature: Folders features

  Background: 
    Given I'm at Minium Developer
    And the active project is "minium-test"

  Scenario: Create new folder
    Given folder "minium-test/newFolder" does not exist
    When I create folder "minium-test/newFolder"
    Then I should see folder "minium-test/newFolder"

  Scenario: Delete folder
    Given folder "minium-test/newFolder" exists
    When I delete folder "minium-test/newFolder"
    Then I should not see folder "minium-test/newFolder"

  Scenario: Create new file
    Given file "minium-test/newFile" does not exist
    When I create file "minium-test/newFile"
    Then I should see file "minium-test/newFile"

  Scenario: delete file
    Given file "minium-test/newFile" exists
    When I delete file "minium-test/newFile"
    Then I should not see file "minium-test/newFile"
