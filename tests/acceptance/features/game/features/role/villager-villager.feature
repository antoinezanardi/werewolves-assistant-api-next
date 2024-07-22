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
    And the game should have the following events
      | type                           |
      | game-starts                    |
      | villager-villager-introduction |
      | game-phase-starts              |
      | game-turn-starts               |
    And the game's event with type "villager-villager-introduction" should have the following players
      | name   |
      | Doudou |
