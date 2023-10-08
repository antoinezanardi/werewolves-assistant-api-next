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
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | Olivia  |

    When the two sisters meet each other
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Julien
    Then the player named Julien should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Maxime
    Then the player named Maxime should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be two-sisters to meet-each-other
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | Olivia  |

    When the two sisters meet each other
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

  Scenario: 👯‍ Two sisters are called never called when options say they are not called at all

    Given a created game with options described in file no-sheriff-option.json, two-sisters-never-waking-up-option.json and with the following players
      | name    | role        |
      | Antoine | two-sisters |
      | Olivia  | two-sisters |
      | JB      | werewolf    |
      | Thomas  | villager    |
      | Maxime  | villager    |
      | Julien  | villager    |
    Then the game's current play should be werewolves to eat

  Scenario: 👯‍ Two sisters wake up every night when options say they are called every night

    Given a created game with options described in file no-sheriff-option.json, two-sisters-waking-up-every-night-option.json and with the following players
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
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be two-sisters to meet-each-other