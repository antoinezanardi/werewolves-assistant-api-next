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
    Then the request should have succeeded with status code 201
    And the game's current play should be raven to mark
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be on-nights
    And the game's current play can be skipped
    And the game's current play should have eligible targets boundaries from 0 to 1
    And the game's current play should have the following eligible targets interactable players
      | name    |
      | Antoine |
      | Olivia  |
      | JB      |
      | Camille |
      | Thomas  |
    And the game's current play eligible targets interactable player named Antoine should have the following interactions
      | source | interaction |
      | raven  | mark        |
    And the game's current play eligible targets interactable player named Olivia should have the following interactions
      | source | interaction |
      | raven  | mark        |
    And the game's current play eligible targets interactable player named JB should have the following interactions
      | source | interaction |
      | raven  | mark        |
    And the game's current play eligible targets interactable player named Camille should have the following interactions
      | source | interaction |
      | raven  | mark        |
    And the game's current play eligible targets interactable player named Thomas should have the following interactions
      | source | interaction |
      | raven  | mark        |

    When the player or group skips his turn
    Then the request should have succeeded with status code 200
    And nobody should have the active raven-marked from raven attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be raven to mark
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the raven marks the player named JB
    Then the request should have succeeded with status code 200
    And the player named JB should have the active raven-marked from raven attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the player named JB should not have the active raven-marked from raven attribute

    When the player or group skips his turn
    Then the game's current play should be raven to mark
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play should have the following eligible targets interactable players
      | name    |
      | Antoine |
      | Olivia  |
      | Camille |

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
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

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

  Scenario: 🐦‍⬛ Raven can't mark an unknown player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | raven    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Camille | villager |
      | Thomas  | villager |
    Then the game's current play should be raven to mark

    When the player or group targets an unknown player
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🐦‍⬛ Raven can't mark a dead player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | raven    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Camille | villager |
      | Thomas  | angel    |
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target  |
      | Olivia  | Camille |
      | JB      | Camille |
      | Antoine | Olivia  |
    Then the player named Camille should be murdered by survivors from vote

    When the raven marks the player named Camille
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Raven can't mark this target"

  Scenario: 🐦‍⬛ Raven can't mark more than one player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | raven    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Camille | villager |
      | Thomas  | villager |
    Then the game's current play should be raven to mark

    When the player or group targets the following players
      | player |
      | Olivia |
      | JB     |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets for this current game's state"