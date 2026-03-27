Feature: Login
  
  As an end user
  I want to interact with the login screen
  So I can access the app through realistic UI flow

  Scenario: Successful login from UI
    Given I open the login screen in the browser
    When I type username "admin" and password "123456"
    And I click the login button
    Then I should see the welcome screen

  Scenario: Failed login from UI
    Given I open the login screen in the browser
    When I type username "admin" and password "senha-incorreta"
    And I click the login button
    Then I should see the login error message "Usuário ou senha inválidos."
