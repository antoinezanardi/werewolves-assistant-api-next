@pied-piper-role

Feature: 🪈 Pied Piper role

  Scenario: 🪈 Pied Piper charms but not call anymore nor doesn't win because he's infected

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | pied-piper            |
      | Olivia  | vile-father-of-wolves |
      | JB      | villager              |
      | Thomas  | villager              |
      | Dad     | villager              |
      | Mom     | villager              |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should have the active eaten from werewolves attribute
    And the game's current play should be pied-piper to charm
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be on-nights
    And the game's current play can not be skipped

    When the pied piper charms the following players
      | name   |
      | Thomas |
      | Olivia |
    Then the request should have succeeded with status code 200
    And 2 of the following players should have the active charmed from pied-piper attribute
      | name   |
      | Olivia |
      | Thomas |
    And the game's current play should be charmed to meet-each-other
    And the game's current play should be played by the following players
      | name   |
      | Olivia |
      | Thomas |
    And the game's current play occurrence should be on-nights
    And the game's current play can be skipped

    When the charmed people meet each other
    Then the request should have succeeded with status code 200
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Dad
    Then the player named Dad should have the active eaten from werewolves attribute
    And the game's current play should be pied-piper to charm

    When the pied piper charms the following players
      | name |
      | Dad  |
      | Mom  |
    Then 3 of the following players should have the active charmed from pied-piper attribute
      | name   |
      | Olivia |
      | Dad    |
      | Mom    |
    And the game's current play should be charmed to meet-each-other
    And the game's current play should be played by the following players
      | name   |
      | Olivia |
      | Dad    |
      | Mom    |

    When the charmed people meet each other
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the vile father of wolves infects the player named Antoine
    Then the player named Antoine should be on werewolves current side and originally be on villagers side
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source  | target |
      | Antoine | Olivia |
      | JB      | Olivia |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's status should be playing

  Scenario: 🪈 Pied Piper can't skip his turn

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | pied-piper            |
      | Olivia  | vile-father-of-wolves |
      | JB      | villager              |
      | Thomas  | villager              |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the game's current play should be pied-piper to charm

    When the player or group skips his turn
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`targets` is required on this current game's state"

  Scenario: 🪈 Pied Piper can't charm an unknown player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | pied-piper            |
      | Olivia  | vile-father-of-wolves |
      | JB      | villager              |
      | Thomas  | villager              |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the game's current play should be pied-piper to charm

    When the pied piper charms the following players
      | name             |
      | Thomas           |
      | <UNKNOWN_PLAYER> |
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "fa5ec24d00ab4a5d1a7b3f71" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🪈 Pied Piper can't charm a dead player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | pied-piper            |
      | Olivia  | vile-father-of-wolves |
      | JB      | angel                 |
      | Thomas  | villager              |
      | Babou   | villager              |
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Babou
    Then the game's current play should be pied-piper to charm

    When the pied piper charms the following players
      | name   |
      | Thomas |
      | Olivia |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "At least one of the pied piper targets can't be charmed"

  Scenario: 🪈 Pied Piper can't charm himself

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | pied-piper            |
      | Olivia  | vile-father-of-wolves |
      | JB      | villager              |
      | Thomas  | villager              |
      | Babou   | villager              |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the game's current play should be pied-piper to charm

    When the pied piper charms the following players
      | name    |
      | Olivia  |
      | Antoine |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "At least one of the pied piper targets can't be charmed"

  Scenario: 🪈 Pied Piper can't charm an already charmed player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | pied-piper            |
      | Olivia  | vile-father-of-wolves |
      | JB      | villager              |
      | Thomas  | villager              |
      | Babou   | villager              |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the game's current play should be pied-piper to charm

    When the pied piper charms the following players
      | name   |
      | Thomas |
      | Olivia |
    Then the game's current play should be charmed to meet-each-other

    When the charmed people meet each other
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the game's current play should be pied-piper to charm

    When the pied piper charms the following players
      | name   |
      | Olivia |
      | Babou  |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "At least one of the pied piper targets can't be charmed"

  Scenario: 🪈 Pied Piper can't charm less than 2 players with default rules

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | pied-piper            |
      | Olivia  | vile-father-of-wolves |
      | JB      | villager              |
      | Thomas  | villager              |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the game's current play should be pied-piper to charm

    When the pied piper charms the following players
      | name |
      | JB   |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too less targets for this current game's state"

  Scenario: 🪈 Pied Piper can't charm more than 2 players with default rules

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | pied-piper            |
      | Olivia  | vile-father-of-wolves |
      | JB      | villager              |
      | Thomas  | villager              |
      | Babou   | villager              |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the game's current play should be pied-piper to charm

    When the pied piper charms the following players
      | name   |
      | Olivia |
      | JB     |
      | Babou  |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets for this current game's state"

  Scenario: 🪈 Pied Piper charms 3 people by night and can win even if he's infected

    Given a created game with options described in file no-sheriff-option.json, pied-piper-charms-three-people-per-night-option.json, pied-piper-not-powerless-if-infected-option.json and with the following players
      | name    | role                  |
      | Antoine | pied-piper            |
      | Olivia  | vile-father-of-wolves |
      | JB      | villager              |
      | Thomas  | villager              |
      | Dad     | villager              |

    When the vile father of wolves infects the player named Antoine
    Then the player named Antoine should be on werewolves current side and originally be on villagers side
    And the game's current play should be pied-piper to charm
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the pied piper charms the following players
      | name   |
      | Thomas |
      | Olivia |
      | JB     |
    Then 3 of the following players should have the active charmed from pied-piper attribute
      | name   |
      | Olivia |
      | JB     |
      | Thomas |
    And the game's current play should be charmed to meet-each-other
    And the game's current play should be played by the following players
      | name   |
      | Olivia |
      | JB     |
      | Thomas |

    When the charmed people meet each other
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should have the active eaten from werewolves attribute
    And the game's current play should be pied-piper to charm

    When the pied piper charms the following players
      | name |
      | Dad  |
    Then 3 of the following players should have the active charmed from pied-piper attribute
      | name   |
      | Olivia |
      | JB     |
      | Dad    |
    And the game's status should be over
    And the game's winners should be pied-piper with the following players
      | name    |
      | Antoine |

  Scenario: 🪈 Pied Piper charms everybody but is dead so he doesn't win

    Given a created game with options described in file no-sheriff-option.json, pied-piper-charms-three-people-per-night-option.json and with the following players
      | name    | role       |
      | Antoine | pied-piper |
      | Olivia  | werewolf   |
      | JB      | villager   |
      | Thomas  | villager   |
      | Dad     | villager   |

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be pied-piper to charm

    When the pied piper charms the following players
      | name   |
      | Thomas |
      | Olivia |
      | JB     |
    Then 3 of the following players should have the active charmed from pied-piper attribute
      | name   |
      | Olivia |
      | JB     |
      | Thomas |
    And the game's current play should be charmed to meet-each-other
    And the game's current play should be played by the following players
      | name   |
      | Olivia |
      | JB     |
      | Thomas |

    When the charmed people meet each other
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | Dad    |
      | JB     | Olivia |
      | Thomas | Dad    |
    Then the player named Dad should be murdered by survivors from vote
    And the game's current play should be werewolves to eat
    And the game's status should be playing