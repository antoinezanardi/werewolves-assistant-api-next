@little-girl-role

Feature: 👧 Little Girl role

  Scenario: 👧 Little Girl is protected by the defender with the right game option

    Given a created game with options described in files no-sheriff-option.json, little-girl-is-protected-by-defender-option.json and with the following players
      | name    | role        |
      | Antoine | werewolf    |
      | Olivia  | little-girl |
      | JB      | defender       |
      | Thomas  | villager    |
    Then the request should have succeeded with status code 201
    And the game's current play should be defender to protect

    When the defender protects the player named Olivia
    Then the player named Olivia should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the request should have succeeded with status code 200
    And the player named Olivia should be alive