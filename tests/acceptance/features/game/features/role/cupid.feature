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
    And the game's current play occurrence should be one-night-only
    And the game's current play can not be skipped
    And the game's current play source should have the following interactions
      | type  | source | minBoundary | maxBoundary |
      | charm | cupid  | 2           | 2           |
    And the game's current play source interaction with type charm should have the following eligible targets
      | name    |
      | Antoine |
      | Olivia  |
      | JB      |
      | Thomas  |

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
    And the game's current play occurrence should be one-night-only
    And the game's current play can be skipped
    And the game's current play source should not have interactions

    When the player or group skips his turn
    Then the request should have succeeded with status code 200
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | JB     |
      | Thomas | JB     |
    Then the player named JB should be murdered by survivors from vote
    And the player named Thomas should be alive
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the player named Thomas should be murdered by cupid from broken-heart
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be over

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
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be cupid to charm

    When the player or group targets the following players
      | name   |
      | JB     |
      | Thomas |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "At least one of the cupid targets can't be charmed"

  Scenario: 💘 Cupid wins with lovers with right good option

    Given a created game with options described in file no-sheriff-option.json, cupid-must-win-with-lovers-option.json and with the following players
      | name    | role     |
      | Antoine | cupid    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | idiot    |
      | Louise  | villager |
    Then the game's current play should be cupid to charm
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be one-night-only
    And the game's current play can not be skipped
    And the game's current play source should have the following interactions
      | type  | source | minBoundary | maxBoundary |
      | charm | cupid  | 2           | 2           |
    And the game's current play source interaction with type charm should have the following eligible targets
      | name   |
      | Olivia |
      | JB     |
      | Thomas |
      | Louise |

    When the cupid shoots an arrow at the player named Olivia and the player named Thomas
    Then the game's current play should be lovers to meet-each-other

    When the lovers meet each other
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Louise
    Then the player named Louise should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source  | target |
      | Antoine | JB     |
      | Thomas  | JB     |
    Then the player named JB should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be over
    And the game's winners should be lovers with the following players
      | name    |
      | Antoine |
      | Olivia  |
      | Thomas  |

  Scenario: 💘 Cupid can't choose himself when he must win with lovers

    Given a created game with options described in file no-sheriff-option.json, cupid-must-win-with-lovers-option.json and with the following players
      | name    | role     |
      | Antoine | cupid    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | idiot    |
      | Louise  | villager |
    Then the game's current play should be cupid to charm
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be one-night-only
    And the game's current play can not be skipped
    And the game's current play source should have the following interactions
      | type  | source | minBoundary | maxBoundary |
      | charm | cupid  | 2           | 2           |
    And the game's current play source interaction with type charm should have the following eligible targets
      | name   |
      | Olivia |
      | JB     |
      | Thomas |
      | Louise |

    When the cupid shoots an arrow at the player named Antoine and the player named Thomas
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "At least one of the cupid targets can't be charmed"

  Scenario: 💘 Lovers win anyway even if cupid is dead and he must win with them

    Given a created game with options described in file no-sheriff-option.json, cupid-must-win-with-lovers-option.json and with the following players
      | name    | role     |
      | Antoine | cupid    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | idiot    |

    When the cupid shoots an arrow at the player named Olivia and the player named Thomas
    Then the game's current play should be lovers to meet-each-other

    When the lovers meet each other
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | JB     |
      | Thomas | JB     |
    Then the player named JB should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be over
    And the game's winners should be lovers with the following players
      | name    |
      | Antoine |
      | Olivia  |
      | Thomas  |

  Scenario: 💘 Cupid can skip if he doesn't have enough targets to charm

    Given a created game with options described in file no-sheriff-option.json, cupid-must-win-with-lovers-option.json and with the following players
      | name    | role     |
      | Antoine | cupid    |
      | Olivia  | werewolf |
      | JB      | hunter   |
      | Thomas  | angel    |
    And the game's current play should be survivors to vote because angel-presence

    When the survivors vote with the following votes
      | source | target |
      | Olivia | JB     |
      | Thomas | JB     |
    Then the player named JB should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be hunter to shoot

    When the hunter shoots at the player named Thomas
    Then the player named Thomas should be murdered by hunter from shot
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be cupid to charm
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be one-night-only
    And the game's current play can be skipped
    And the game's current play source should not have interactions

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten

  Scenario: 💘 Cupid turn is skipped if he has no targets and options say that roles must be skipped if no targets

    Given a created game with options described in file no-sheriff-option.json, cupid-must-win-with-lovers-option.json, skip-roles-call-if-no-target-option.json and with the following players
      | name    | role     |
      | Antoine | cupid    |
      | Olivia  | werewolf |
      | JB      | hunter   |
      | Thomas  | angel    |
    And the game's current play should be survivors to vote because angel-presence

    When the survivors vote with the following votes
      | source | target |
      | Olivia | JB     |
      | Thomas | JB     |
    Then the player named JB should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be hunter to shoot

    When the hunter shoots at the player named Thomas
    Then the player named Thomas should be murdered by hunter from shot
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat