@role

Feature: 🃏 Role

  Scenario: 🃏 Role is revealed when the player dies
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | JB      | werewolf |
      | Thomas  | villager |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the player named Antoine should have his role revealed

  Scenario: 🃏 Role is not revealed when the player dies with the correct option
    Given a created game with options described in file no-sheriff-option.json, role-not-revealed-on-death-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | JB      | werewolf |
      | Thomas  | villager |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the player named Antoine should not have his role revealed