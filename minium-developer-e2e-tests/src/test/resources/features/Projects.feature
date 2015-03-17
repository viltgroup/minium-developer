@runit
Feature: Manage Minium Projects

  Background: 
    Given I'm at Minium Developer

  Scenario: Create new Automator project
    When I create the following project:
      | Project type | Automator Project             |
      | Project Name | minium-automator-${timestamp} |
    Then the active project should be "minium-automator-${timestamp}"
    And I should see the following files:
      | minium-automator-${timestamp}/modules |
      | minium-automator-${timestamp}/main.js |

  Scenario: Creating new Automator project fails due to existing project
    Given project "minium-test" exists
    When I try to create the following project:
      | Project type | Automator Project |
      | Project Name | minium-test       |
    Then I should see the following validation messages:
      | Project Name | There's already a project in this path!! |

  Scenario: Create new Cucumber project
    When I create the following project:
      | Project type | Cucumber project             |
      | Project Name | minium-cucumber-${timestamp} |
      | Group ID     | io.vilt.minium.test          |
      | Version      | 1.0.5-SNAPSHOT               |
      | Feature file | my-feature                   |
      | Step file    | my-steps                     |
    Then the active project should be "minium-cucumber-${timestamp}"
    And I should see the following files:
      | minium-cucumber-${timestamp}/config/application.yml      |
      | minium-cucumber-${timestamp}/logback-test.xml            |
      | minium-cucumber-${timestamp}/steps/my-steps.js           |
      | minium-cucumber-${timestamp}/features/my-feature.feature |
