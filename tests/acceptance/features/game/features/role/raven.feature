@raven-role

Feature: 🐦‍⬛ Raven role

  Scenario: 🐦‍⬛ Raven marks a player but can also skip
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | raven    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Camille | villager |
      | Thomas  | villager |
    Then the game's current play should be raven to mark

    When the player or group skips his turn
    Then nobody should have the active raven-marked from raven attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be raven to mark

    When the raven marks the player named JB
    Then the player named JB should have the active raven-marked from raven attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the player named JB should not have the active raven-marked from raven attribute

    When the player or group skips his turn
    Then the game's current play should be raven to mark

    When the raven marks the player named Antoine
    Then the player named Antoine should have the active raven-marked from raven attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Camille
    Then the player named Camille should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the player named Antoine should be murdered by survivors from vote

  Scenario: 🐦‍⬛ Raven marks a player with a greater mark than the default one with good option
    Given a created game with options described in file no-sheriff-option.json, raven-mark-penalty-is-three-option.json and with the following players
      | name    | role     |
      | Antoine | raven    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Camille | villager |
      | Thomas  | villager |
    Then the game's current play should be raven to mark

    When the raven marks the player named JB
    Then the player named JB should have the active raven-marked from raven attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target  |
      | Olivia  | Camille |
      | JB      | Camille |
      | Antoine | Olivia  |
    Then the player named JB should be murdered by survivors from vote