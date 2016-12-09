# language: en
# ------------------------------------------------------------------------------
Feature: Print Application Form

  Background: 
    Given I'm at Stanbic Page

  Scenario: Email address is missing
    When I fill:
      #comment
      | First name                 | MiniumCenas     |
      | Last name                  | VILT            |
      | Contact number             | 211223344       |
      | Alternative contact number | 211334455       |
      | Email address              |                 |
      | Date of Birth              | 02-10-2015      |
      | State                      | Portugal        |
      | Address                    | Minium's Street |
      | Product                    | Current Account |
      | Employment Status          | Unemployed      |
    #end
    And I click on "Submit"
    Then I should see the warning message "This is a required field."

  Scenario: Invalid email
    When I fill:
      | First name                 | Minium          |
      | Last name                  | VILT            |
      | Contact number             | 211223344       |
      | Alternative contact number | 211334455       |
      | Email address              | minium email    |
      | Date of Birth              | 02-10-2015      |
      | State                      | Portugal        |
      | Address                    | Minium's Street |
      | Product                    | Current Account |
      | Employment Status          | Unemployed      |
    And I click on "Submit"
    Then I should see the warning message "Enter valid email address."

  Scenario: Print the form
    When I fill:
      | First name                 | Minium           |
      | Last name                  | VILT             |
      | Contact number             | 211223344        |
      | Alternative contact number | 211334455        |
      | Email address              | minium@email.com |
      | Date of Birth              | 02-10-2015       |
      | State                      | Portugal         |
      | Address                    | Minium's Street  |
      | Product                    | Current Account  |
      | Employment Status          | Unemployed       |
    #aasdasd#And I click on "Submit"
    Then I should see the message "Thank you for submitting the application form"
