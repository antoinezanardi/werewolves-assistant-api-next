@cupid-role

Feature: 💘 Cupid role

  Scenario: 💘 Cupid makes two people fall in love and they die if one of them dies

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | cupid    |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | idiot    |
    And the game's current play should be cupid to charm
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the cupid shoots an arrow at the player named JB and the player named Thomas
    Then 2 of the following players should have the active in-love from cupid attribute
      | name   |
      | JB     |
      | Thomas |
    And the game's current play should be lovers to meet-each-other
    And the game's current play should be played by the following players
      | name   |
      | JB     |
      | Thomas |

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | target |
      | Olivia | JB     |
      | Thomas | JB     |
    Then the player named JB should be murdered by survivors from vote
    And the player named Thomas should be murdered by cupid from broken-heart
    And the game's status should be over