@guard-role
Feature: 🛡️ Guard role

  Scenario: 🛡️ Guard protects against every kind of werewolves but nor for the little girl
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role         |
      | Antoine | guard        |
      | Olivia  | werewolf     |
      | JB      | big-bad-wolf |
      | Thomas  | villager     |
      | Nana    | little-girl  |
      | Juju    | villager     |
      | Cari    | villager     |

    When the guard protects the player named Antoine
    Then the player named Antoine should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat

    When the big bad wolf eats the player named Juju
    Then the player named Juju should be murdered by big-bad-wolf from eaten
    And the player named Antoine should be alive
    And the game's current play should be all to vote

    When the player or group skips his turn
    Then the game's current play should be guard to protect

    When the guard protects the player named Nana
    Then the player named Nana should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Nana
    Then the player named Nana should have the active eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat

    When the big bad wolf eats the player named Thomas
    Then the player named Thomas should be murdered by big-bad-wolf from eaten
    But the player named Nana should be murdered by werewolves from eaten
    And the game's current play should be all to vote

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

  Scenario: 🛡️ Guard can't protect from other attack than werewolves
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | guard    |
      | Olivia  | werewolf |
      | JB      | witch    |
      | Thomas  | villager |

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

    When the guard protects the player named Thomas
    Then the player named Thomas should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be alive
    And the game's current play should be all to vote

    When the player or group skips his turn
    Then the game's current play should be guard to protect

    When the guard protects the player named Thomas
    Then the player named Thomas should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be alive
    And the game's current play should be all to vote