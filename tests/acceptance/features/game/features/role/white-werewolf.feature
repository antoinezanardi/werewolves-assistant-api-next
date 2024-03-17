@white-werewolf-role

Feature: 🐺🦴White Werewolf role

  Scenario: 🐺🦴White Werewolf can eat an ally or skip every other night

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role              |
      | Antoine | villager          |
      | JB      | werewolf          |
      | Olivia  | white-werewolf    |
      | Thomas  | defender          |
      | Olaf    | villager-villager |
      | Elsa    | idiot             |
      | Patoche | villager          |
    Then the request should have succeeded with status code 201

    When the defender protects the player named Antoine
    Then the player named Antoine should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be white-werewolf to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |
    And the game's current play type should be target
    And the game's current play occurrence should be on-nights
    And the game's current play can be skipped
    And the game's current play source should have the following interactions
      | type | source         | minBoundary | maxBoundary |
      | eat  | white-werewolf | 0           | 1           |
    And the game's current play source interaction with type eat should have the following eligible targets
      | name |
      | JB   |

    When the player or group skips his turn
    Then the request should have succeeded with status code 200
    And the player named Antoine should be alive
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source  | target  |
      | Antoine | Olaf    |
      | Thomas  | Olaf    |
      | JB      | Antoine |
    Then the player named Olaf should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be defender to protect

    When the defender protects the player named Thomas
    Then the player named Thomas should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be alive
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target  |
      | Thomas | Antoine |
      | JB     | Antoine |
    Then the player named Antoine should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be defender to protect

    When the defender protects the player named Olivia
    Then the player named Olivia should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Elsa
    Then the player named Elsa should have the active eaten from werewolves attribute
    And the game's current play should be white-werewolf to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |
    And the game's current play can be skipped

    When the white werewolf eats the player named JB
    Then the request should have succeeded with status code 200
    And the player named JB should be murdered by white-werewolf from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target  |
      | Olivia | Patoche |
    Then the player named Patoche should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be defender to protect

    When the defender protects the player named Thomas
    Then the player named Thomas should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    And the game's current play should be defender to protect

    When the defender protects the player named Olivia
    Then the player named Olivia should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should have the active eaten from werewolves attribute
    And the game's current play should be white-werewolf to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |
    And the game's current play can be skipped
    And the game's current play source should not have interactions

    When the player or group skips his turn
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be over
    And the game's winners should be white-werewolf with the following players
      | name   |
      | Olivia |

  Scenario: 🐺🦴White Werewolf can eat an ally or skip every night and his role is skipped if no targets

    Given a created game with options described in file no-sheriff-option.json, white-werewolf-waking-up-every-night-option.json, skip-roles-call-if-no-target-option.json and with the following players
      | name    | role           |
      | Antoine | villager       |
      | JB      | werewolf       |
      | Olivia  | white-werewolf |
      | Thomas  | defender       |

    When the defender protects the player named Antoine
    Then the player named Antoine should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be white-werewolf to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the player or group skips his turn
    Then the game's current play should be survivors to vote
    And the player named Antoine should be alive

    When the player or group skips his turn
    Then the game's current play should be defender to protect

    When the defender protects the player named Olivia
    Then the player named Olivia should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be white-werewolf to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the white werewolf eats the player named JB
    Then the player named Antoine should be murdered by werewolves from eaten
    And the player named JB should be murdered by white-werewolf from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be defender to protect

    When the defender protects the player named Thomas
    Then the player named Thomas should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be alive
    And the game's current play should be survivors to vote

  Scenario: 🐺🦴White Werewolf can skip if he has no other wolves to eat

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role           |
      | Antoine | villager       |
      | JB      | villager       |
      | Olivia  | white-werewolf |
      | Thomas  | villager       |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be white-werewolf to eat
    And the game's current play can be skipped
    And the game's current play source should not have interactions

    When the player or group skips his turn
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

  Scenario: 🐺🦴White Werewolf can't eat an unknown target

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role           |
      | Antoine | villager       |
      | JB      | werewolf       |
      | Olivia  | white-werewolf |
      | Thomas  | villager       |

    When the werewolves eat the player named Antoine
    Then the game's current play should be white-werewolf to eat

    When the player or group targets an unknown player
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🐺🦴White Werewolf can't eat a dead target

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role           |
      | Antoine | angel          |
      | JB      | werewolf       |
      | Olivia  | white-werewolf |
      | Thomas  | villager       |
      | Nana    | werewolf       |

    When the survivors vote with the following votes
      | source  | target |
      | Antoine | JB     |
      | Thomas  | JB     |
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the game's current play should be white-werewolf to eat

    When the white werewolf eats the player named JB
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "White werewolf can't eat this target"

  Scenario: 🐺🦴White Werewolf can't eat a villager

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role           |
      | Antoine | villager       |
      | JB      | werewolf       |
      | Olivia  | white-werewolf |
      | Thomas  | villager       |

    When the werewolves eat the player named Thomas
    Then the game's current play should be white-werewolf to eat

    When the white werewolf eats the player named Antoine
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "White werewolf can't eat this target"

  Scenario: 🐺🦴White Werewolf can't eat multiple targets at once

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role           |
      | Antoine | villager       |
      | JB      | werewolf       |
      | Olivia  | white-werewolf |
      | Thomas  | werewolf       |

    When the werewolves eat the player named Antoine
    Then the game's current play should be white-werewolf to eat

    When the player or group targets the following players
      | player |
      | JB     |
      | Thomas |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets for this current game's state"

  Scenario: 🐺🦴White Werewolf can't eat himself

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role           |
      | Antoine | villager       |
      | JB      | werewolf       |
      | Olivia  | white-werewolf |
      | Thomas  | werewolf       |

    When the werewolves eat the player named Antoine
    Then the game's current play should be white-werewolf to eat

    When the white werewolf eats the player named Olivia
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "White werewolf can't eat this target"