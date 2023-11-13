@guard-role

Feature: 🛡️ Guard role

  Scenario: 🛡️ Guard protects against every kind of werewolves but not for the little girl

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role         |
      | Antoine | guard        |
      | Olivia  | werewolf     |
      | JB      | big-bad-wolf |
      | Thomas  | villager     |
      | Nana    | little-girl  |
      | Juju    | villager     |
      | Cari    | villager     |
    Then the request should have succeeded with status code 201
    And the game's current play should be guard to protect
    And the game's current play can not be skipped
    And the game's current play should have eligible targets boundaries from 1 to 1
    And the game's current play should have the following eligible targets interactable players
      | name    |
      | Antoine |
      | Olivia  |
      | JB      |
      | Thomas  |
      | Nana    |
      | Juju    |
      | Cari    |
    And the game's current play eligible targets interactable player named Antoine should have the following interactions
      | source | interaction |
      | guard  | protect     |
    And the game's current play eligible targets interactable player named Olivia should have the following interactions
      | source | interaction |
      | guard  | protect     |
    And the game's current play eligible targets interactable player named JB should have the following interactions
      | source | interaction |
      | guard  | protect     |
    And the game's current play eligible targets interactable player named Thomas should have the following interactions
      | source | interaction |
      | guard  | protect     |
    And the game's current play eligible targets interactable player named Nana should have the following interactions
      | source | interaction |
      | guard  | protect     |
    And the game's current play eligible targets interactable player named Juju should have the following interactions
      | source | interaction |
      | guard  | protect     |
    And the game's current play eligible targets interactable player named Cari should have the following interactions
      | source | interaction |
      | guard  | protect     |

    When the guard protects the player named Antoine
    Then the request should have succeeded with status code 200
    And the player named Antoine should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat

    When the big bad wolf eats the player named Juju
    Then the player named Juju should be murdered by big-bad-wolf from eaten
    And the player named Antoine should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be guard to protect
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be on-nights
    And the game's current play can not be skipped
    And the game's current play should have eligible targets boundaries from 1 to 1
    And the game's current play should have the following eligible targets interactable players
      | name    |
      | Olivia  |
      | JB      |
      | Thomas  |
      | Nana    |
      | Cari    |

    When the guard protects the player named Nana
    Then the player named Nana should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Nana
    Then the player named Nana should have the active eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat

    When the big bad wolf eats the player named Thomas
    Then the player named Thomas should be murdered by big-bad-wolf from eaten
    But the player named Nana should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be guard to protect

    When the guard protects the player named Cari
    Then the player named Cari should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat

    When the big bad wolf eats the player named Cari
    Then the player named Cari should be alive
    And the player named Antoine should be murdered by werewolves from eaten

  Scenario: 🛡️ Guard can't skip his turn

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | guard    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | villager |
    Then the game's current play should be guard to protect
    And the game's current play can not be skipped

    When the player or group skips his turn
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`targets` is required on this current game's state"

  Scenario: 🛡️ Guard can't protect an unknown player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | guard    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | villager |
    Then the game's current play should be guard to protect

    When the player or group targets an unknown player
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🛡️ Guard can't protect a dead player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | guard    |
      | Olivia  | werewolf |
      | JB      | angel    |
      | Thomas  | villager |
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | name   | vote   |
      | Olivia | Thomas |
      | JB     | Thomas |
    Then the game's current play should be guard to protect

    When the guard protects the player named Thomas
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Guard can't protect this target"

  Scenario: 🛡️ Guard can't protect twice in a row the same player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | guard    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | villager |
    Then the game's current play should be guard to protect
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the guard protects the player named Thomas
    Then the player named Thomas should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be guard to protect

    When the guard protects the player named Thomas
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Guard can't protect this target"

  Scenario: 🛡️ Guard can't protect more than one player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | guard    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | villager |
    Then the game's current play should be guard to protect

    When the player or group targets the following players
      | name   |
      | Thomas |
      | Olivia |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets for this current game's state"

  Scenario: 🛡️ Guard doesn't protect from other attack than werewolves

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | guard    |
      | Olivia  | werewolf |
      | JB      | witch    |
      | Thomas  | villager |
    Then the game's current play should be guard to protect
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the guard protects the player named Thomas
    Then the player named Thomas should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the witch uses death potion on the player named Thomas
    Then the player named Thomas should be murdered by witch from death-potion
    And the player named JB should be murdered by werewolves from eaten

  Scenario: 🛡️ Guard can protect twice the same player with correct option

    Given a created game with options described in file no-sheriff-option.json, guard-can-protect-twice-option.json and with the following players
      | name    | role     |
      | Antoine | guard    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | villager |
    Then the game's current play should be guard to protect
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the guard protects the player named Thomas
    Then the player named Thomas should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be guard to protect
    And the game's current play should have the following eligible targets interactable players
      | name    |
      | Antoine |
      | Olivia  |
      | JB      |
      | Thomas  |

    When the guard protects the player named Thomas
    Then the player named Thomas should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be alive
    And the game's current play should be survivors to vote