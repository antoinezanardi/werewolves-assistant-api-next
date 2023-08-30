@two-sisters-role
Feature: 👯‍ Two sisters role

  Scenario: 👯‍ Two sisters are called every other night and not called anymore if one dies
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role        |
      | Antoine | two-sisters |
      | Olivia  | two-sisters |
      | JB      | werewolf    |
      | Thomas  | villager    |
      | Maxime  | villager    |
      | Julien  | villager    |
    Then the game's current play should be two-sisters to meet-each-other

    When the two sisters meet each other
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Julien
    Then the player named Julien should be murdered by werewolves from eaten
    And the game's current play should be all to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Maxime
    Then the player named Maxime should be murdered by werewolves from eaten
    And the game's current play should be all to vote

    When the player or group skips his turn
    Then the game's current play should be two-sisters to meet-each-other

    When the two sisters meet each other
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be all to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat
