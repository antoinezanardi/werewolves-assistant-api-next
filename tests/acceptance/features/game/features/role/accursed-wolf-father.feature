@accursed-wolf-father-role

Feature: 🐺 Accursed Wolf-Father role

  Scenario: 🐺 Accursed Wolf-Father infects a player instead of eating it

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                 |
      | Antoine | accursed-wolf-father |
      | Olivia  | seer                 |
      | JB      | villager             |
      | Thomas  | villager             |
    Then the game's current play should be seer to look

    When the seer looks at the player named Antoine
    Then the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the werewolves eat the player named Olivia
    Then the player named Olivia should have the active eaten from werewolves attribute
    And the game's current play should be accursed-wolf-father to infect
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be on-nights
    And the game's current play can be skipped
    And the game's current play source should have the following interactions
      | type   | source               | minBoundary | maxBoundary |
      | infect | accursed-wolf-father | 0           | 1           |
    And the game's current play source interaction with type infect should have the following eligible targets
      | name   |
      | Olivia |

    When the accursed wolf-father infects the player named Olivia
    Then the request should have succeeded with status code 200
    And the player named Olivia should be on werewolves current side and originally be on villagers side
    And the player named Olivia should be alive
    And the player named Olivia should not have the active eaten from werewolves attribute
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be seer to look

  Scenario: 🐺 Accursed Wolf-Father doesn't infect the elder if he still have lives

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                 |
      | Antoine | accursed-wolf-father |
      | Olivia  | elder                |
      | JB      | villager             |
      | Thomas  | villager             |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should have the active eaten from werewolves attribute
    And the game's current play should be accursed-wolf-father to infect

    When the accursed wolf-father infects the player named Olivia
    Then the player named Olivia should be on villagers current side and originally be on villagers side
    And the player named Olivia should be alive

  Scenario: 🐺 Accursed Wolf-Father infects the elder if he only has one life left

    Given a created game with options described in files no-sheriff-option.json, elder-one-life-against-werewolves-option.json and with the following players
      | name    | role                 |
      | Antoine | accursed-wolf-father |
      | Olivia  | elder                |
      | JB      | villager             |
      | Thomas  | villager             |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should have the active eaten from werewolves attribute
    And the game's current play should be accursed-wolf-father to infect

    When the accursed wolf-father infects the player named Olivia
    Then the player named Olivia should be on werewolves current side and originally be on villagers side
    And the player named Olivia should be alive

  Scenario: 🐺 Accursed Wolf-Father can't infect if he's dead

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                 |
      | Antoine | accursed-wolf-father |
      | Olivia  | angel                |
      | JB      | werewolf             |
      | Thomas  | villager             |
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | against |
      | Olivia | Antoine |
    Then the game's current play should be survivors to bury-dead-bodies
    And the game's current play source should not have interactions
    And the game's current play can be skipped

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the game's current play should be survivors to bury-dead-bodies

  Scenario: 🐺 Accursed Wolf-Father can't infect an unknown target

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                 |
      | Antoine | accursed-wolf-father |
      | Olivia  | villager             |
      | JB      | werewolf             |
      | Thomas  | villager             |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should have the active eaten from werewolves attribute
    And the game's current play should be accursed-wolf-father to infect

    When the player or group targets an unknown player
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🐺 Accursed Wolf-Father can't infect a target which is not a werewolves target

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                 |
      | Antoine | accursed-wolf-father |
      | Olivia  | villager             |
      | JB      | werewolf             |
      | Thomas  | villager             |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should have the active eaten from werewolves attribute
    And the game's current play should be accursed-wolf-father to infect

    When the accursed wolf-father infects the player named Thomas
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Accursed Wolf-father can't infect this target"

  Scenario: 🐺 Accursed Wolf-Father can't infect multiple times but can skip his turn

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                 |
      | Antoine | accursed-wolf-father |
      | Olivia  | villager             |
      | JB      | villager             |
      | Thomas  | villager             |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should have the active eaten from werewolves attribute
    And the game's current play should be accursed-wolf-father to infect

    When the player or group skips his turn
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should have the active eaten from werewolves attribute
    And the game's current play should be accursed-wolf-father to infect
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be on-nights
    And the game's current play can be skipped
    And the game's current play source should have the following interactions
      | type   | source               | minBoundary | maxBoundary |
      | infect | accursed-wolf-father | 0           | 1           |
    And the game's current play source interaction with type infect should have the following eligible targets
      | name   |
      | Thomas |

    When the accursed wolf-father infects the player named Thomas
    Then the player named Thomas should be on werewolves current side and originally be on villagers side
    And the player named Thomas should be alive
    And the player named Thomas should not have the active eaten from werewolves attribute
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should have the active eaten from werewolves attribute
    And the game's current play should be accursed-wolf-father to infect
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be on-nights
    And the game's current play can be skipped
    And the game's current play source should not have interactions

    When the player or group skips his turn
    Then the game's current play should be survivors to bury-dead-bodies

  Scenario: 🐺 Accursed Wolf-Father can't infect multiple targets at once

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                 |
      | Antoine | accursed-wolf-father |
      | Olivia  | villager             |
      | JB      | villager             |
      | Thomas  | villager             |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should have the active eaten from werewolves attribute
    And the game's current play should be accursed-wolf-father to infect

    When the player or group targets the following players
      | name   |
      | Olivia |
      | Thomas |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets for this current game's state"

  Scenario: 🐺 Accursed Wolf-Father turn is skipped if he already infected someone with the right game option

    Given a created game with options described in files no-sheriff-option.json, skip-roles-call-if-no-target-option.json and with the following players
      | name    | role                 |
      | Antoine | accursed-wolf-father |
      | Olivia  | villager             |
      | JB      | villager             |
      | Thomas  | villager             |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should have the active eaten from werewolves attribute

    When the accursed wolf-father infects the player named Olivia
    Then the player named Olivia should be on werewolves current side and originally be on villagers side
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should have the active eaten from werewolves attribute
    And the game's current play should be survivors to bury-dead-bodies