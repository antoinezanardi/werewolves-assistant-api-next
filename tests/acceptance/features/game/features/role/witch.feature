@witch-role

Feature: 🪄 Witch role

  Scenario: 🪄 Witch uses healing potion when the target is dying from werewolves

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
    And the game's current play occurrence should be on-nights

    When the witch uses life potion on the player named Juju
    Then the player named Juju should be alive

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

    When the witch uses death potion on the player named Doudou
    Then the player named Juju should be murdered by werewolves from eaten
    And the player named Doudou should be murdered by witch from death-potion

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

    When the player or group skips his turn
    Then the player named Juju should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

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
    Then the player named Juju should be alive
    And the player named Doudou should be murdered by witch from death-potion
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be witch to use-potions

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
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be survivors to vote