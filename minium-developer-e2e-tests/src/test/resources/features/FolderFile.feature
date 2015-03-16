@runit
Feature: Folders features

  Background: 
    Given I'm at Minium Developer
    And the active project is "minium-test"

  Scenario Outline: Create new folder
    Given folder "<path>" does not exist
    When I create folder "<path>"
    Then I should see folder "<path>"

    Examples: 
      | path                                                                  |
      | minium-test/newFolder                                                 |
      | minium-test/newFolder/folder-1/folder-1.1/folder-1.1.1/folder-1.1.1.1 |

  Scenario Outline: Delete folder
    Given folder "<path>" exists
    When I delete folder "<path>"
    Then I should not see folder "<path>"

    Examples: 
      | path                                                                  |
      | minium-test/newFolder/folder-1/folder-1.1/folder-1.1.1/folder-1.1.1.1 |
      | minium-test/newFolder                                                 |

  Scenario Outline: Create new file
    Given file "<path>" does not exist
    When I create file "<path>"
    Then I should see file "<path>"

    Examples: 
      | path                                                           |
      | minium-test/newFile                                            |
      | minium-test/newFolder/folder-1/folder-1.1/folder-1.1.1/newFile |

  Scenario Outline: delete file
    Given file "<path>" exists
    When I delete file "<path>"
    Then I should not see file "<path>"

    Examples: 
      | path                                                           |
      | minium-test/newFolder/folder-1/folder-1.1/folder-1.1.1/newFile |
      | minium-test/newFile                                            |
