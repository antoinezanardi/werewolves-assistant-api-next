@big-bad-wolf-role
Feature: 🐺👹 Big Bad Wolf role

  Scenario: 🐺👹Big Bad Wolf eats every night but powerless if one werewolf dies
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role         |
      | Antoine | witch        |
      | JB      | werewolf     |
      | Olivia  | big-bad-wolf |
      | Thomas  | seer         |
    Then the request should have succeeded with status code 201
    And the game's current play should be seer to look

    When the seer looks at the player named Antoine
    Then the player named Antoine should have the active seen from seer attribute
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name   |
      | JB     |
      | Olivia |

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat
    And the game's current play should not have causes
    And the game's current play should be played by the following players
      | name   |
      | Olivia |
    And the game's current play type should be target
    And the game's current play occurrence should be on-nights
    And the game's current play can not be skipped
    And the game's current play source should have the following interactions
      | type | source       | minBoundary | maxBoundary |
      | eat  | big-bad-wolf | 1           | 1           |
    And the game's current play source interaction with type eat should have the following eligible targets
      | name   |
      | Thomas |
    And the game's current play source interaction with type eat should have consequences

    When the big bad wolf eats the player named Thomas
    Then the request should have succeeded with status code 200
    And the player named Thomas should have the active eaten from big-bad-wolf attribute
    And the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Thomas
    Then the player named Antoine should be murdered by werewolves from eaten
    But the player named Thomas should be alive
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | JB     |
      | Thomas | JB     |
    Then the player named JB should be murdered by survivors from vote
    And the player named Olivia should not have the active powerless from werewolves attribute
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the player named Olivia should have the active powerless from werewolves attribute
    And the game's current play should be seer to look

    When the seer looks at the player named Olivia
    Then the player named Olivia should have the active seen from seer attribute
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be over
    And the game's winners should be werewolves with the following players
      | name   |
      | JB     |
      | Olivia |

  Scenario: 🐺👹Big Bad Wolf can't eat an unknown player
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role         |
      | Antoine | villager     |
      | JB      | werewolf     |
      | Olivia  | big-bad-wolf |
      | Thomas  | villager     |
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be big-bad-wolf to eat

    When the player or group targets an unknown player
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🐺👹Big Bad Wolf can't eat a dead player
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role         |
      | Antoine | angel        |
      | JB      | werewolf     |
      | Olivia  | big-bad-wolf |
      | Thomas  | villager     |
      | Babou   | villager     |
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | Thomas |
      | JB     | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be big-bad-wolf to eat

    When the big bad wolf eats the player named Thomas
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Big bad wolf can't eat this target"

  Scenario: 🐺👹Big Bad Wolf can't skip his turn if he has available targets
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role         |
      | Antoine | villager     |
      | JB      | werewolf     |
      | Olivia  | big-bad-wolf |
      | Thomas  | villager     |
      | Babou   | villager     |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be big-bad-wolf to eat
    And the game's current play can not be skipped
    And the game's current play source should have the following interactions
      | type | source       | minBoundary | maxBoundary |
      | eat  | big-bad-wolf | 1           | 1           |
    And the game's current play source interaction with type eat should have the following eligible targets
      | name   |
      | Thomas |
      | Babou  |

    When the player or group skips his turn
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`targets` is required on this current game's state"

  Scenario: 🐺👹Big Bad Wolf can't eat another wolf
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role         |
      | Antoine | angel        |
      | JB      | werewolf     |
      | Olivia  | big-bad-wolf |
      | Thomas  | villager     |
      | Babou   | villager     |
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | Thomas |
      | JB     | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be big-bad-wolf to eat

    When the big bad wolf eats the player named JB
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Big bad wolf can't eat this target"

  Scenario: 🐺👹Big Bad Wolf can't eat more than one target
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role         |
      | Antoine | angel        |
      | JB      | werewolf     |
      | Olivia  | big-bad-wolf |
      | Thomas  | villager     |
      | Babou   | villager     |
      | Juju    | villager     |
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | Thomas |
      | JB     | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be big-bad-wolf to eat

    When the player or group targets the following players
      | name  |
      | Babou |
      | Juju  |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets for this current game's state"

  Scenario: 🐺👹Big Bad Wolf eats every night and not powerless if one werewolf dies with right option
    Given a created game with options described in file no-sheriff-option.json, big-bad-wolf-not-powerless-if-werewolf-dies-option.json and with the following players
      | name    | role         |
      | Antoine | witch        |
      | JB      | werewolf     |
      | Olivia  | big-bad-wolf |
      | Thomas  | seer         |

    When the seer looks at the player named Antoine
    Then the player named Antoine should have the active seen from seer attribute
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name   |
      | JB     |
      | Olivia |

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the big bad wolf eats the player named Thomas
    Then the player named Thomas should have the active eaten from big-bad-wolf attribute
    And the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Thomas
    Then the player named Antoine should be murdered by werewolves from eaten
    But the player named Thomas should be alive
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | JB     |
      | Thomas | JB     |
    Then the player named JB should be murdered by survivors from vote
    And the player named Olivia should not have the active powerless from werewolves attribute
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the player named Olivia should not have the active powerless from werewolves attribute
    And the game's current play should be seer to look

    When the seer looks at the player named Olivia
    Then the player named Olivia should have the active seen from seer attribute
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the werewolves eat the player named Thomas
    Then the player named Thomas should have the active eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat

    When the player or group skips his turn
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be over
    And the game's winners should be werewolves with the following players
      | name   |
      | JB     |
      | Olivia |

  Scenario: 🐺👹Big Bad Wolf eats every night but his role is skipped if no targets with right option
    Given a created game with options described in file no-sheriff-option.json, skip-roles-call-if-no-target-option.json and with the following players
      | name    | role         |
      | Antoine | witch        |
      | JB      | werewolf     |
      | Olivia  | big-bad-wolf |
      | Thomas  | defender     |
      | Doudou  | villager     |

    When the defender protects the player named Antoine
    Then the player named Antoine should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |
    And the game's current play source should have the following interactions
      | type | source       | minBoundary | maxBoundary |
      | eat  | big-bad-wolf | 1           | 1           |
    And the game's current play source interaction with type eat should have the following eligible targets
      | name   |
      | Thomas |
      | Doudou |

    When the big bad wolf eats the player named Doudou
    Then the player named Doudou should have the active eaten from big-bad-wolf attribute
    And the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the player named Doudou should be murdered by big-bad-wolf from eaten
    But the player named Antoine should be alive
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | Thomas |
      | JB     | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be over
    And the game's winners should be werewolves with the following players
      | name   |
      | JB     |
      | Olivia |

  Scenario: 🐺👹Big Bad Wolf eats every night and can skip if he has no targets available
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role         |
      | Antoine | witch        |
      | JB      | werewolf     |
      | Olivia  | big-bad-wolf |
      | Thomas  | defender     |
      | Doudou  | villager     |

    When the defender protects the player named Antoine
    Then the player named Antoine should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the big bad wolf eats the player named Doudou
    Then the player named Doudou should have the active eaten from big-bad-wolf attribute
    And the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the player named Doudou should be murdered by big-bad-wolf from eaten
    But the player named Antoine should be alive
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | Thomas |
      | JB     | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be big-bad-wolf to eat
    And the game's current play can be skipped
    And the game's current play source should not have interactions

    When the player or group skips his turn
    Then the request should have succeeded with status code 200
