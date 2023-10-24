@cupid-role

Feature: 💘 Cupid role

  Scenario: 💘 Cupid makes two people fall in love and they die if one of them dies

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | cupid    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | idiot    |
    Then the request should have succeeded with status code 201
    And the game's current play should be cupid to charm
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be first-night-only
    And the game's current play can not be skipped

    When the cupid shoots an arrow at the player named JB and the player named Thomas
    Then the request should have succeeded with status code 200
    And 2 of the following players should have the active in-love from cupid attribute
      | name   |
      | JB     |
      | Thomas |
    And the game's current play should be lovers to meet-each-other
    And the game's current play should be played by the following players
      | name   |
      | JB     |
      | Thomas |
    And the game's current play occurrence should be first-night-only
    And the game's current play can be skipped

    When the player or group skips his turn
    Then the request should have succeeded with status code 200
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | JB     |
      | Thomas | JB     |
    Then the player named JB should be murdered by survivors from vote
    And the player named Thomas should be murdered by cupid from broken-heart
    And the game's status should be over

  Scenario: 💘 Cupid can't skip his turn

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | cupid    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | idiot    |
    Then the game's current play should be cupid to charm

    When the player or group skips his turn
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`targets` is required on this current game's state"

  Scenario: 💘 Cupid can't choose only one target

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | cupid    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | idiot    |
    Then the game's current play should be cupid to charm

    When the player or group targets the following players
      | name   |
      | Olivia |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too less targets for this current game's state"

  Scenario: 💘 Cupid can't choose more than two targets

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | cupid    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | idiot    |
    Then the game's current play should be cupid to charm

    When the player or group targets the following players
      | name   |
      | Olivia |
      | JB     |
      | Thomas |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets for this current game's state"

  Scenario: 💘 Cupid can't choose an unknown player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | cupid    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | idiot    |
    Then the game's current play should be cupid to charm

    When the player or group targets the following players
      | name             |
      | Thomas           |
      | <UNKNOWN_PLAYER> |
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "fa5ec24d00ab4a5d1a7b3f71" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 💘 Cupid can't choose a dead player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | cupid    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | angel    |
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | JB     |
      | Thomas | JB     |
    Then the player named JB should be murdered by survivors from vote
    And the game's current play should be cupid to charm

    When the player or group targets the following players
      | name   |
      | JB     |
      | Thomas |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "At least one of the cupid targets can't be charmed"