@white-werewolf-role

Feature: 🐺🦴White Werewolf role

  Scenario: 🐺🦴White Werewolf can eat or skip every other night an ally

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role              |
      | Antoine | villager          |
      | JB      | werewolf          |
      | Olivia  | white-werewolf    |
      | Thomas  | guard             |
      | Olaf    | villager-villager |
      | Elsa    | idiot             |
      | Patoche | villager          |

    When the guard protects the player named Antoine
    Then the player named Antoine should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be white-werewolf to eat
    And the game's current play should be played by the following players
      | name    |
      | Olivia  |
    And the game's current play occurrence should be on-nights

    When the player or group skips his turn
    Then the game's current play should be survivors to vote
    And the player named Antoine should be alive

    When the survivors vote with the following votes
      | source  | target  |
      | Antoine | Olaf    |
      | Thomas  | Olaf    |
      | JB      | Antoine |
    Then the player named Olaf should be murdered by survivors from vote
    And the game's current play should be guard to protect

    When the guard protects the player named Thomas
    Then the player named Thomas should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be alive
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target  |
      | Thomas | Antoine |
      | JB     | Antoine |
    Then the player named Antoine should be murdered by survivors from vote
    And the game's current play should be guard to protect

    When the guard protects the player named Olivia
    Then the player named Olivia should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Elsa
    Then the player named Elsa should have the active eaten from werewolves attribute
    And the game's current play should be white-werewolf to eat
    And the game's current play should be played by the following players
      | name    |
      | Olivia  |

    When the white werewolf eats the player named JB
    Then the player named JB should be murdered by white-werewolf from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target  |
      | Olivia | Patoche |
    Then the player named Patoche should be murdered by survivors from vote
    And the game's current play should be guard to protect

    When the guard protects the player named Thomas
    Then the player named Thomas should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    And the game's current play should be guard to protect

    When the guard protects the player named Olivia
    Then the player named Olivia should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should have the active eaten from werewolves attribute
    And the game's current play should be white-werewolf to eat
    And the game's current play should be played by the following players
      | name    |
      | Olivia  |

    When the player or group skips his turn
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's status should be over
    And the game's winners should be white-werewolf with the following players
      | name   |
      | Olivia |

  Scenario: 🐺🦴White Werewolf can eat or skip every night an ally and his role is skipped if no targets
    Given a created game with options described in file no-sheriff-option.json, white-werewolf-waking-up-every-night-option.json, skip-roles-call-if-no-target-option.json and with the following players
      | name    | role              |
      | Antoine | villager          |
      | JB      | werewolf          |
      | Olivia  | white-werewolf    |
      | Thomas  | guard             |

    When the guard protects the player named Antoine
    Then the player named Antoine should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be white-werewolf to eat
    And the game's current play should be played by the following players
      | name    |
      | Olivia  |

    When the player or group skips his turn
    Then the game's current play should be survivors to vote
    And the player named Antoine should be alive

    When the player or group skips his turn
    Then the game's current play should be guard to protect

    When the guard protects the player named Olivia
    Then the player named Olivia should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be white-werewolf to eat
    And the game's current play should be played by the following players
      | name    |
      | Olivia  |

    When the white werewolf eats the player named JB
    Then the player named Antoine should be murdered by werewolves from eaten
    And the player named JB should be murdered by white-werewolf from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be guard to protect

    When the guard protects the player named Thomas
    Then the player named Thomas should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be alive
    And the game's current play should be survivors to vote