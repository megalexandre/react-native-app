Feature: Login integration
  As an app user
  I want to authenticate through the login service
  So I can access protected app areas

  Scenario: Successful login with mock interception
    Given mock API interception is enabled
    When I login with username "admin" and password "123456"
    Then I receive a valid auth token
    And the authenticated username should be "admin"

  Scenario: Failed login with invalid credentials
    Given mock API interception is enabled
    When I login with username "admin" and password "wrong-pass"
    Then login should fail with message "Usuário ou senha inválidos."
