Feature: Login
  
  As an end user
  I want to interact with the login screen
  So I can access the app through realistic UI flow

  Background: 
    Given I open the login screen in the browser

  Scenario: Successful login from UI
   
    When I type username "admin" and password "123456"
    And I click the login button
    Then I should see the welcome screen

  Scenario: Failed login from UI
    When I type username "admin" and password "senha-incorreta"
    And I click the login button
    Then I should see the login toast message "Usuário ou senha inválidos."

  Scenario: Attempt without name
    When I type username "" and password "123456"
    And I click the login button
    Then I should see the login error message "Usuário é obrigatório"

  Scenario: Attempt without password
    When I type username "admin" and password ""
    And I click the login button
    Then I should see the login error message "Senha é obrigatória"
