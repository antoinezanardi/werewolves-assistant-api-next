Feature: 🐺👹 Big Bad Wolf role

  Scenario: 🐺👹Big Bad Wolf eats every night but powerless if one werewolf dies
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role         |
      | Antoine | witch        |
      | JB      | werewolf     |
      | Olivia  | big-bad-wolf |
      | Thomas  | seer         |

    When the seer looks at the player named Antoine
    Then the player named Antoine should have the seen from seer attribute
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name   |
      | JB     |
      | Olivia |

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the big bad wolf eats the player named Thomas
    Then the player named Thomas should have the eaten from big-bad-wolf attribute
    And the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Thomas
    Then the player named Antoine should be murdered by werewolves from eaten
    But the player named Thomas should be alive
    And the game's current play should be all to vote

    When all vote with the following votes
      | source | target |
      | Olivia | JB     |
      | Thomas | JB     |
    Then the player named JB should be murdered by all from vote
    And the game's current play should be seer to look

    When the seer looks at the player named Olivia
    Then the player named Olivia should have the seen from seer attribute
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's status should be over
    And the game's winners should be werewolves with the following players
      | name   |
      | JB     |
      | Olivia |

  Scenario: 🐺👹Big Bad Wolf eats every night and not powerless if one werewolf dies
    Given a created game with options described in file no-sheriff-option.json, big-bad-wolf-not-powerless-if-werewolf-dies-option.json and with the following players
      | name    | role         |
      | Antoine | witch        |
      | JB      | werewolf     |
      | Olivia  | big-bad-wolf |
      | Thomas  | seer         |

    When the seer looks at the player named Antoine
    Then the player named Antoine should have the seen from seer attribute
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name   |
      | JB     |
      | Olivia |

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the big bad wolf eats the player named Thomas
    Then the player named Thomas should have the eaten from big-bad-wolf attribute
    And the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Thomas
    Then the player named Antoine should be murdered by werewolves from eaten
    But the player named Thomas should be alive
    And the game's current play should be all to vote

    When all vote with the following votes
      | source | target |
      | Olivia | JB     |
      | Thomas | JB     |
    Then the player named JB should be murdered by all from vote
    And the game's current play should be seer to look

    When the seer looks at the player named Olivia
    Then the player named Olivia should have the seen from seer attribute
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the werewolves eat the player named Thomas
    Then the player named Thomas should have the eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat

    When the player or group skips his turn
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's status should be over
    And the game's winners should be werewolves with the following players
      | name   |
      | JB     |
      | Olivia |

  Scenario: 🐺👹Big Bad Wolf eats every night but his role is skipped if no targets
    Given a created game with options described in file no-sheriff-option.json, skip-roles-call-if-no-target-option.json and with the following players
      | name    | role         |
      | Antoine | witch        |
      | JB      | werewolf     |
      | Olivia  | big-bad-wolf |
      | Thomas  | guard        |
      | Doudou  | villager     |

    When the guard protects the player named Antoine
    Then the player named Antoine should have the protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the big bad wolf eats the player named Doudou
    Then the player named Doudou should have the eaten from big-bad-wolf attribute
    And the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the player named Doudou should be murdered by big-bad-wolf from eaten
    But the player named Antoine should be alive
    And the game's current play should be all to vote

    When all vote with the following votes
      | source | target |
      | Olivia | Thomas |
      | JB     | Thomas |
    Then the player named Thomas should be murdered by all from vote
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's status should be over
    And the game's winners should be werewolves with the following players
      | name   |
      | JB     |
      | Olivia |