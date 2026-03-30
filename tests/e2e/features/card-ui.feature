@card
Feature: Card UI

  As an authenticated user
  I want to see the dashboard cards with expected content
  So I can trust the payment summary information

  Background:
    Given I am logged in and on the dashboard page

  Scenario: Balance card displays key content

    Then I should see the card "dashboard-balance-card"
    
    And the card "dashboard-balance-card" should have title "Saldo disponível"
    And the card "dashboard-balance-card" should have subtitle "Atualizado agora"
    And the card "dashboard-balance-card" should have right slot text "Hoje"
    And the card "dashboard-balance-card" should have content text "R$ 12.480,90"
    And the card "dashboard-balance-card" should have footer text "Ver extrato"

  Scenario: Pending payments card displays expected content

    Then I should see the card "dashboard-pending-card"
    And the card "dashboard-pending-card" should have title "Próximos pagamentos"
    And the card "dashboard-pending-card" should have subtitle "2 cobranças pendentes"
    And the card "dashboard-pending-card" should have content text "Plano Pro · R$ 89,90 · vence amanhã"
    And the card "dashboard-pending-card" should have content text "Serviço de API · R$ 249,00 · vence em 3 dias"
