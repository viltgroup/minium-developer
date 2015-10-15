@runit
Feature: Test console

  Background: 
    Given I'm at Minium Developer
    And I click on toolbar "Help > About"

  Scenario Outline: Verify info about minium
    Then I should see the info of "<label>"

    Examples: 
      | label                             |
      | Version                           |
      | Date                              |
      | Commit Hash                       |
      | There is a new version available? |

  Scenario: VILT's logo
    Then I should see the image which has alternative text "VILT logo"
