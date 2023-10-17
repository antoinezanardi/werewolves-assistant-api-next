@fox-role

Feature: 🦊 Fox role

  Scenario: 🦊 Fox is powerless if he misses a werewolf of any kind

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | fox                   |
      | Juju    | villager              |
      | Doudou  | villager              |
      | JB      | vile-father-of-wolves |
      | Olivia  | werewolf              |
      | Thomas  | villager              |
      | Coco    | idiot                 |
    Then the game's current play should be fox to sniff
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be on-nights

    When the fox sniffs the player named Doudou
    Then the player named Antoine should not have the active powerless from fox attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Coco
    Then the player named Coco should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be fox to sniff
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be on-nights
    And the game's current play can be skipped

    When the player or group skips his turn
    Then the player named Antoine should not have the active powerless from fox attribute

    When the werewolves eat the player named Juju
    Then the player named Juju should be murdered by werewolves from eaten

    When the player or group skips his turn
    Then the game's current play should be fox to sniff

    When the fox sniffs the player named Antoine
    Then the player named Antoine should have the active powerless from fox attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

  Scenario: 🦊 Fox is not powerless if he misses a werewolf of any kind with game option

    Given a created game with options described in files no-sheriff-option.json, fox-not-powerless-if-misses-werewolf-option.json and with the following players
      | name    | role                  |
      | Antoine | fox                   |
      | Juju    | villager              |
      | Doudou  | villager              |
      | JB      | vile-father-of-wolves |
      | Olivia  | werewolf              |
      | Thomas  | villager              |
      | Coco    | idiot                 |
    Then the game's current play should be fox to sniff
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the fox sniffs the player named Juju
    Then the player named Antoine should not have the active powerless from fox attribute