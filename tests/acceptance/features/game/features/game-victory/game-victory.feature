@game-victory

Feature: 🏆 Game Victory

  Scenario: 🧑🏻‍🌾 Villagers win the game

    Given a created game with the following players
      | name    | role     |
      | Antoine | witch    |
      | JB      | werewolf |
      | Olivia  | hunter   |
      | Thomas  | seer     |

    When the survivors elect sheriff with the following votes
      | source  | target  |
      | Antoine | Olivia  |
      | Thomas  | Olivia  |
      | JB      | Antoine |
      | Olivia  | JB      |
    Then the player named Olivia should have the active sheriff from survivors attribute
    And the game's tick should be 2
    And the game's turn should be 1
    And the game's phase should be night
    And the game's current play should be seer to look

    When the seer looks at the player named Antoine
    Then the player named Antoine should have the active seen from seer attribute
    And the game's tick should be 3
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should have the active eaten from werewolves attribute
    And the game's tick should be 4
    And the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Thomas
    Then the game's turn should be 1
    And the game's phase should be day
    And the player named Thomas should be alive
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source  | target  |
      | Antoine | Olivia  |
      | Thomas  | Olivia  |
      | JB      | Antoine |
    Then the player named Olivia should be murdered by survivors from vote
    And the game's phase should be day
    And the game's current play should be hunter to shoot

    When the hunter shoots at the player named JB
    Then the player named JB should be murdered by hunter from shot
    And the game's status should be over
    And the game's winners should be villagers with the following players
      | name    |
      | Antoine |
      | Olivia  |
      | Thomas  |

  Scenario: 🐺 Werewolves win the game

    Given a created game with the following players
      | name    | role     |
      | Antoine | witch    |
      | JB      | werewolf |
      | Olivia  | hunter   |
      | Thomas  | seer     |

    When the survivors elect sheriff with the following votes
      | source  | target  |
      | Antoine | Olivia  |
      | Thomas  | Olivia  |
      | JB      | Antoine |
      | Olivia  | Antoine |
    Then the game's current play should be survivors to elect-sheriff because previous-votes-were-in-ties
    But nobody should have the active sheriff from survivors attribute

    When the survivors elect sheriff with the following votes
      | source  | target |
      | Antoine | Olivia |
      | Thomas  | Olivia |
    Then the player named Olivia should have the active sheriff from survivors attribute
    And the game's current play should be seer to look

    When the seer looks at the player named JB
    Then the player named JB should have the active seen from seer attribute
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name |
      | JB   |

    When the werewolves eat the player named Thomas
    Then the player named Thomas should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the witch uses death potion on the player named Olivia
    Then the game's phase should be day
    And the player named Olivia should be murdered by witch from death-potion
    And the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be sheriff to delegate

    When the sheriff delegates his role to the player named Antoine
    Then the player named Antoine should have the active sheriff from sheriff attribute
    And the game's current play should be hunter to shoot
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the hunter shoots at the player named Antoine
    Then the player named Antoine should be murdered by hunter from shot
    And the game's status should be over
    And the game's winners should be werewolves with the following players
      | name |
      | JB   |

  Scenario: ☠️ Nobody wins the game

    Given a created game with the following players
      | name    | role     |
      | Antoine | witch    |
      | JB      | werewolf |
      | Olivia  | hunter   |
      | Thomas  | seer     |

    When the survivors elect sheriff with the following votes
      | source  | target  |
      | Antoine | JB      |
      | Thomas  | JB      |
      | JB      | Antoine |
      | Olivia  | Antoine |
    Then the game's current play should be survivors to elect-sheriff because previous-votes-were-in-ties
    But nobody should have the active sheriff from survivors attribute

    When the survivors elect sheriff with the following votes
      | source  | target  |
      | Antoine | JB      |
      | Thomas  | Antoine |
    Then 1 of the following players should have the active sheriff from survivors attribute
      | name    |
      | Antoine |
      | JB      |
    And the game's current play should be seer to look
    And the game's current play should be played by the following players
      | name   |
      | Thomas |

    When the seer looks at the player named JB
    Then the player named JB should have the active seen from seer attribute
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name |
      | JB   |

    When the werewolves eat the player named Olivia
    Then the player named Olivia should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Olivia
    Then the player named Olivia should be alive
    And nobody should have the active eaten from werewolves attribute
    And nobody should have the active drank-life-potion from witch attribute
    And the game's phase should be day
    And the game's current play should be survivors to vote
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | JB      |
      | Olivia  |
      | Thomas  |

    When the survivors vote with the following votes
      | source  | target |
      | Antoine | Olivia |
      | Thomas  | Olivia |
      | JB      | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And the game's current play should be hunter to shoot

    When the hunter shoots at the player named Thomas
    Then the player named Thomas should be murdered by hunter from shot
    And the game's phase should be night
    And the game's turn should be 2
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the witch uses death potion on the player named JB
    Then the game's status should be over
    And the game's winners should be none with the following players
      | name |

  Scenario: 💞Lovers win the game

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | JB      | werewolf |
      | Olivia  | cupid    |
      | Thomas  | seer     |

    When the cupid shoots an arrow at the player named Olivia and the player named JB
    Then 2 of the following players should have the active in-love from cupid attribute
      | name   |
      | Olivia |
      | JB     |
    And the game's current play should be seer to look

    When the seer looks at the player named Antoine
    Then the player named Antoine should have the active seen from seer attribute
    And the game's current play should be lovers to meet-each-other
    And the game's current play should be played by the following players
      | name   |
      | JB     |
      | Olivia |

    When the lovers meet each other
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the witch uses death potion on the player named Antoine
    Then the player named Thomas should be murdered by werewolves from eaten
    And the player named Antoine should be murdered by witch from death-potion
    And the game's status should be over
    And the game's winners should be lovers with the following players
      | name   |
      | JB     |
      | Olivia |

  Scenario: 👼 Angel wins the game with the first votes

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | JB      | werewolf |
      | Olivia  | cupid    |
      | Thomas  | angel    |
    Then the game's current play should be survivors to vote because angel-presence

    When the survivors vote with the following votes
      | source  | target |
      | Antoine | Thomas |
      | Olivia  | Thomas |
      | JB      | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's status should be over
    And the game's winners should be angel with the following players
      | name   |
      | Thomas |

  Scenario: 👼 Angel wins the game with first murder of wolves

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | JB      | werewolf |
      | Olivia  | cupid    |
      | Thomas  | angel    |
    Then the game's current play should be survivors to vote because angel-presence

    When the survivors vote with the following votes
      | source  | target |
      | Antoine | Olivia |
      | Thomas  | Olivia |
      | JB      | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's status should be over
    And the game's winners should be angel with the following players
      | name   |
      | Thomas |

  Scenario: 🐺🦴 White werewolf wins the game

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role           |
      | Antoine | witch          |
      | JB      | werewolf       |
      | Olivia  | guard          |
      | Thomas  | white-werewolf |

    When the guard protects the player named Olivia
    Then the player named Olivia should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be white-werewolf to eat

    When the white werewolf eats the player named JB
    Then the player named JB should have the active eaten from white-werewolf attribute
    And the game's current play should be witch to use-potions

    When the witch uses death potion on the player named Olivia
    Then the player named Antoine should be murdered by werewolves from eaten
    And the player named JB should be murdered by white-werewolf from eaten
    And the player named Olivia should be murdered by witch from death-potion
    And the game's status should be over
    And the game's winners should be white-werewolf with the following players
      | name   |
      | Thomas |

  Scenario: 🪈Pied Piper wins the game

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Antoine | witch      |
      | JB      | werewolf   |
      | Olivia  | guard      |
      | Thomas  | pied-piper |

    When the guard protects the player named Thomas
    Then the player named Thomas should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the game's current play should be pied-piper to charm

    When the pied piper charms the following players
      | name   |
      | Olivia |
      | JB     |
    Then 2 of the following players should have the active charmed from pied-piper attribute
      | name   |
      | JB     |
      | Olivia |
    And the game's current play should be charmed to meet-each-other
    And the game's current play should be played by the following players
      | name   |
      | JB     |
      | Olivia |

    When the charmed people meet each other
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's status should be over
    And the game's winners should be pied-piper with the following players
      | name   |
      | Thomas |

  Scenario: 🏆 No more game plays can be made when game is over

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | witch    |
      | JB      | werewolf |
      | Olivia  | cupid    |
      | Thomas  | angel    |
    Then the game's current play should be survivors to vote because angel-presence

    When the survivors vote with the following votes
      | source  | target |
      | Antoine | Olivia |
      | Thomas  | Olivia |
      | JB      | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's status should be over

    When the survivors vote with the following votes
      | source  | target |
      | Antoine | Olivia |
      | Thomas  | Olivia |
      | JB      | Olivia |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Game doesn't have status with value "playing""