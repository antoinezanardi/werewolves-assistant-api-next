@villager-villager-role
Feature: 🧑🏻‍🌾 Villager-Villager role

  Scenario: 🧑🏻‍🌾 Villager-Villager role is revealed at the beginning of the game
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role              |
      | Antoine | villager          |
      | Juju    | witch             |
      | Doudou  | villager-villager |
      | Thom    | werewolf          |
    Then the request should have succeeded with status code 201
    And the player named Doudou should have his role revealed
