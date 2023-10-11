@three-brothers-role

Feature: 👨‍👨‍👦 Three Brothers role

  Scenario: 👨‍👨‍👦 Three Brothers are called every other night and not called anymore if two die

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role           |
      | Antoine | three-brothers |
      | Olivia  | three-brothers |
      | Thomas  | three-brothers |
      | JB      | werewolf       |
      | Maxime  | villager       |
      | Julien  | villager       |
    Then the game's current play should be three-brothers to meet-each-other
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | Olivia  |
      | Thomas  |
    And the game's current play occurrence should be on-nights

    When the three brothers meet each other
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Maxime
    Then the player named Maxime should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be three-brothers to meet-each-other
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | Olivia  |

    When the three brothers meet each other
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Julien
    Then the player named Julien should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

  Scenario: 👨‍👨‍👦 Three Brothers are never called when options say they are not called at all

    Given a created game with options described in file no-sheriff-option.json, three-brothers-never-waking-up-option.json and with the following players
      | name    | role           |
      | Antoine | three-brothers |
      | Olivia  | three-brothers |
      | Thomas  | three-brothers |
      | JB      | werewolf       |
      | Maxime  | villager       |
      | Julien  | villager       |
    Then the game's current play should be werewolves to eat

  Scenario: 👨‍👨‍👦 Three Brothers are waking up every night when options say they are called every night

    Given a created game with options described in file no-sheriff-option.json, three-brothers-waking-up-every-night-option.json and with the following players
      | name    | role           |
      | Antoine | three-brothers |
      | Olivia  | three-brothers |
      | Thomas  | three-brothers |
      | JB      | werewolf       |
      | Maxime  | villager       |
      | Julien  | villager       |
    Then the game's current play should be three-brothers to meet-each-other
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | Olivia  |
      | Thomas  |

    When the three brothers meet each other
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be three-brothers to meet-each-other
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | Olivia  |