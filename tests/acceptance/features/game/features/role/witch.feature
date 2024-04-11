@witch-role

Feature: 🪄 Witch role

  Scenario: 🪄 Witch uses life potion when the target is dying from werewolves

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | Juju    | villager |
      | Doudou  | villager |
      | Thom    | werewolf |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be witch to use-potions
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play type should be target
    And the game's current play occurrence should be on-nights
    And the game's current play can be skipped
    And the game's current play source should have the following interactions
      | type              | source | minBoundary | maxBoundary |
      | give-life-potion  | witch  | 0           | 1           |
      | give-death-potion | witch  | 0           | 1           |
    And the game's current play source interaction with type give-life-potion should have the following eligible targets
      | name |
      | Juju |
    And the game's current play source interaction with type give-life-potion should have consequences
    And the game's current play source interaction with type give-death-potion should have the following eligible targets
      | name    |
      | Antoine |
      | Doudou  |
      | Thom    |

    When the witch uses life potion on the player named Juju
    Then the request should have succeeded with status code 200
    And the player named Juju should be alive

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be witch to use-potions
    And the game's current play source should have the following interactions
      | type              | source | minBoundary | maxBoundary |
      | give-death-potion | witch  | 0           | 1           |
    And the game's current play source interaction with type give-death-potion should have the following eligible targets
      | name    |
      | Antoine |
      | Doudou  |
      | Thom    |
    And the game's current play source interaction with type give-death-potion should have consequences

  Scenario: 🪄 Witch uses death potion to kill someone

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | Juju    | villager |
      | Doudou  | villager |
      | Thom    | werewolf |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be witch to use-potions
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play source should have the following interactions
      | type              | source | minBoundary | maxBoundary |
      | give-life-potion  | witch  | 0           | 1           |
      | give-death-potion | witch  | 0           | 1           |

    When the witch uses death potion on the player named Doudou
    Then the request should have succeeded with status code 200
    And the player named Juju should be murdered by werewolves from eaten
    And the player named Doudou should be murdered by witch from death-potion
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be witch to use-potions
    And the game's current play source should have the following interactions
      | type             | source | minBoundary | maxBoundary |
      | give-life-potion | witch  | 0           | 1           |
    And the game's current play source interaction with type give-life-potion should have the following eligible targets
      | name    |
      | Antoine |

  Scenario: 🪄 Witch can skip her turn

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | Juju    | villager |
      | Doudou  | villager |
      | Thom    | werewolf |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be witch to use-potions
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play can be skipped

    When the player or group skips his turn
    Then the request should have succeeded with status code 200
    And the player named Juju should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

  Scenario: 🪄 Witch use both potions at the same time

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | Juju    | villager |
      | Doudou  | villager |
      | Thom    | werewolf |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be witch to use-potions
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the witch uses life potion on the player named Juju and death potion on the player named Doudou
    Then the request should have succeeded with status code 200
    And the player named Juju should be alive
    And the player named Doudou should be murdered by witch from death-potion
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be witch to use-potions
    And the game's current play source should not have interactions

  Scenario: 🪄 Witch is not called anymore if she used all of her potions with the right option

    Given a created game with options described in file no-sheriff-option.json, skip-roles-call-if-no-target-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | Juju    | villager |
      | Doudou  | villager |
      | Thom    | werewolf |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be witch to use-potions
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the witch uses life potion on the player named Juju and death potion on the player named Doudou
    Then the player named Juju should be alive
    And the player named Doudou should be murdered by witch from death-potion
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

  Scenario: 🪄 Witch can't use her life potion on an unknown target

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | Juju    | villager |
      | Doudou  | villager |
      | Thom    | werewolf |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be witch to use-potions

    When the witch uses life potion on an unknown player
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🪄 Witch can't use her death potion on an unknown target

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | Juju    | villager |
      | Doudou  | villager |
      | Thom    | werewolf |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be witch to use-potions

    When the witch uses death potion on an unknown player
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🪄 Witch can't use her life potion on a target which is not dying from werewolves

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | Juju    | villager |
      | Doudou  | werewolf |
      | Thom    | werewolf |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Antoine
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Life potion can't be applied to this target (`targets.drankPotion`)"

  Scenario: 🪄 Witch can't use her death potion on a dead target

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | Juju    | angel    |
      | Doudou  | villager |
      | Thom    | werewolf |
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter | against |
      | Juju  | Doudou  |
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be witch to use-potions

    When the witch uses death potion on the player named Doudou
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Death potion can't be applied to this target (`targets.drankPotion`)"

  Scenario: 🪄 Witch can't use her death potion on a eaten target

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | Juju    | villager |
      | Doudou  | villager |
      | Thom    | werewolf |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be witch to use-potions

    When the witch uses death potion on the player named Juju
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Death potion can't be applied to this target (`targets.drankPotion`)"

  Scenario: 🪄 Witch can't use her life potion more than once

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | Juju    | villager |
      | Doudou  | villager |
      | Thom    | werewolf |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Juju
    Then the player named Juju should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Antoine
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`targets.drankPotion` can't be set on this current game's state"

  Scenario: 🪄 Witch can't use her death potion more than once

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | Juju    | villager |
      | Doudou  | villager |
      | Thom    | werewolf |
      | Mum     | villager |
      | Dad     | villager |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be witch to use-potions

    When the witch uses death potion on the player named Doudou
    Then the player named Doudou should be murdered by witch from death-potion
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be witch to use-potions

    When the witch uses death potion on the player named Thom
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`targets.drankPotion` can't be set on this current game's state"

  Scenario: 🪄 Witch can't use life potion on multiple targets

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role         |
      | Antoine | witch        |
      | Doudou  | villager     |
      | Thom    | werewolf     |
      | Mum     | villager     |
      | Dad     | villager     |
      | Sis     | big-bad-wolf |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Doudou
    Then the game's current play should be big-bad-wolf to eat

    When the big bad wolf eats the player named Dad
    Then the game's current play should be witch to use-potions

    When the witch uses life potion on the following players
      | player |
      | Doudou |
      | Dad    |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets which drank life potion (`targets.drankPotion`)"

  Scenario: 🪄 Witch can't use death potion on multiple targets

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | Doudou  | villager |
      | Thom    | werewolf |
      | Mum     | villager |
      | Dad     | villager |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Doudou
    Then the game's current play should be witch to use-potions

    When the witch uses death potion on the following players
      | player  |
      | Antoine |
      | Thom    |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets which drank death potion (`targets.drankPotion`)"