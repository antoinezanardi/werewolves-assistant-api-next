@big-bad-wolf-role
Feature: 🐺👹 Big Bad Wolf role

  Scenario: 🐺👹Big Bad Wolf eats every night but powerless if one werewolf dies

    Given a created game with options described in file no-sheriff-option.json and with the following players
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
    And the game's current play occurrence should be on-nights
    And the game's current play can not be skipped

    When the big bad wolf eats the player named Thomas
    Then the player named Thomas should have the active eaten from big-bad-wolf attribute
    And the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Thomas
    Then the player named Antoine should be murdered by werewolves from eaten
    But the player named Thomas should be alive
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | JB     |
      | Thomas | JB     |
    Then the player named JB should be murdered by survivors from vote
    And the game's current play should be seer to look

    When the seer looks at the player named Olivia
    Then the player named Olivia should have the active seen from seer attribute
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
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | JB     |
      | Thomas | JB     |
    Then the player named JB should be murdered by survivors from vote
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
    And the game's status should be over
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
      | Thomas  | guard        |
      | Doudou  | villager     |

    When the guard protects the player named Antoine
    Then the player named Antoine should have the active protected from guard attribute
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
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | Thomas |
      | JB     | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
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


  Scenario: 🐺👹Big Bad Wolf eats every night and can skip if he has no targets available

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role         |
      | Antoine | witch        |
      | JB      | werewolf     |
      | Olivia  | big-bad-wolf |
      | Thomas  | guard        |
      | Doudou  | villager     |

    When the guard protects the player named Antoine
    Then the player named Antoine should have the active protected from guard attribute
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
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | Thomas |
      | JB     | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be big-bad-wolf to eat
    And the game's current play can be skipped