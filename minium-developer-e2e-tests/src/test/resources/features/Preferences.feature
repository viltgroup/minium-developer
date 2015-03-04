Feature: Editor Preferences

  Background: 
    Given I am at section "Editor"
    And I click on toolbar "Preferences > Preferences"

  Scenario Outline: Test theme
    When I fill:
      | Theme   |
      | <theme> |
    Then I should see a notification with text "Preferences updated with success"
    And the editor should have the class <class>

    Examples: 
      | theme  | class      |
      | Chrome | ace-chrome |

  Scenario: Test font size

  Scenario: Test reset to default
