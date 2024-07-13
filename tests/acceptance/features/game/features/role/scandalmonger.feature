@scandalmonger-role
Feature: 🐦‍⬛ Scandalmonger role

  Scenario: 🐦‍⬛ Scandalmonger marks a player but can also skip
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role          |
      | Antoine | scandalmonger |
      | Olivia  | werewolf      |
      | JB      | villager      |
      | Camille | villager      |
      | Thomas  | villager      |
    Then the request should have succeeded with status code 201
    And the game's current play should be scandalmonger to mark
    And the game's current play should not have causes
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play type should be target
    And the game's current play occurrence should be on-nights
    And the game's current play can be skipped
    And the game's current play source should have the following interactions
      | type | source        | minBoundary | maxBoundary |
      | mark | scandalmonger | 0           | 1           |
    And the game's current play source interaction with type mark should have the following eligible targets
      | name    |
      | Antoine |
      | Olivia  |
      | JB      |
      | Camille |
      | Thomas  |
    And the game's current play source interaction with type mark should have consequences

    When the player or group skips his turn
    Then the request should have succeeded with status code 200
    And nobody should have the active scandalmonger-marked from scandalmonger attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be scandalmonger to mark
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the scandalmonger marks the player named JB
    Then the request should have succeeded with status code 200
    And the player named JB should have the active scandalmonger-marked from scandalmonger attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the player named JB should have the active scandalmonger-marked from scandalmonger attribute
    And the game's current play should be survivors to bury-dead-bodies
    And the game's current play source should have the following interactions
      | type | source    | minBoundary | maxBoundary |
      | bury | survivors | 0           | 1           |
    And the game's current play source interaction with type bury should have the following eligible targets
      | name |
      | JB   |
    And the game's current play source interaction with type bury should be inconsequential
    And the game's current play can be skipped

    When the survivors bury dead bodies
    Then the player named JB should not have the active scandalmonger-marked from scandalmonger attribute
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be scandalmonger to mark
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play source should have the following interactions
      | type | source        | minBoundary | maxBoundary |
      | mark | scandalmonger | 0           | 1           |
    And the game's current play source interaction with type mark should have the following eligible targets
      | name    |
      | Antoine |
      | Olivia  |
      | Camille |

    When the scandalmonger marks the player named Antoine
    Then the player named Antoine should have the active scandalmonger-marked from scandalmonger attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Camille
    Then the player named Camille should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the player named Antoine should be murdered by survivors from vote

  Scenario: 🐦‍⬛ Scandalmonger marks a player with a greater mark than the default one with good option
    Given a created game with options described in file no-sheriff-option.json, scandalmonger-mark-penalty-is-three-option.json and with the following players
      | name    | role          |
      | Antoine | scandalmonger |
      | Olivia  | werewolf      |
      | JB      | villager      |
      | Camille | villager      |
      | Thomas  | villager      |
    Then the game's current play should be scandalmonger to mark
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the scandalmonger marks the player named JB
    Then the player named JB should have the active scandalmonger-marked from scandalmonger attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target  |
      | Olivia  | Camille |
      | JB      | Camille |
      | Antoine | Olivia  |
    Then the player named JB should be murdered by survivors from vote

  Scenario: 🐦‍⬛ Scandalmonger can't mark an unknown player
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role          |
      | Antoine | scandalmonger |
      | Olivia  | werewolf      |
      | JB      | villager      |
      | Camille | villager      |
      | Thomas  | villager      |
    Then the game's current play should be scandalmonger to mark

    When the player or group targets an unknown player
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🐦‍⬛ Scandalmonger can't mark a dead player
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role          |
      | Antoine | scandalmonger |
      | Olivia  | werewolf      |
      | JB      | villager      |
      | Camille | villager      |
      | Thomas  | angel         |
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target  |
      | Olivia  | Camille |
      | JB      | Camille |
      | Antoine | Olivia  |
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the player named Camille should be murdered by survivors from vote

    When the scandalmonger marks the player named Camille
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Scandalmonger can't mark this target"

  Scenario: 🐦‍⬛ Scandalmonger can't mark more than one player
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role          |
      | Antoine | scandalmonger |
      | Olivia  | werewolf      |
      | JB      | villager      |
      | Camille | villager      |
      | Thomas  | villager      |
    Then the game's current play should be scandalmonger to mark

    When the player or group targets the following players
      | player |
      | Olivia |
      | JB     |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets for this current game's state"
