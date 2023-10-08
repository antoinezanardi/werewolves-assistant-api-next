@little-girl-role

Feature: 👧 Little Girl role

  Scenario: 👧 Little Girl is protected by the guard with the right game option

    Given a created game with options described in files no-sheriff-option.json, little-girl-is-protected-by-guard-option.json and with the following players
      | name    | role        |
      | Antoine | werewolf    |
      | Olivia  | little-girl |
      | JB      | guard       |
      | Thomas  | villager    |

    When the guard protects the player named Olivia
    Then the player named Olivia should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be alive