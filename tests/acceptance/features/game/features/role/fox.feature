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
    Then the request should have succeeded with status code 201
    And the game's current play should be fox to sniff
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be on-nights
    And the game's current play can be skipped
    And the game's current play should have eligible targets boundaries from 0 to 1

    When the fox sniffs the player named Doudou
    Then the request should have succeeded with status code 200
    And the player named Antoine should not have the active powerless from fox attribute
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

  Scenario: 🦊 Fox can't sniff an unknown player

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | fox                   |
      | Juju    | villager              |
      | Doudou  | villager              |
      | JB      | vile-father-of-wolves |
    Then the game's current play should be fox to sniff

    When the player or group targets an unknown player
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🦊 Fox can't sniff a dead player

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | fox                   |
      | Juju    | angel                 |
      | Doudou  | villager              |
      | JB      | vile-father-of-wolves |
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | vote | target |
      | Juju | Doudou |
    Then the game's current play should be fox to sniff

    When the fox sniffs the player named Doudou
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Fox can't sniff this target"

  Scenario: 🦊 Fox can't sniff more than one player

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | fox                   |
      | Juju    | villager              |
      | Doudou  | villager              |
      | JB      | vile-father-of-wolves |
    Then the game's current play should be fox to sniff

    When the fox sniffs the player named Doudou
    Then the request should have succeeded with status code 200

    When the player or group targets the following players
      | target |
      | Juju   |
      | Doudou |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets for this current game's state"