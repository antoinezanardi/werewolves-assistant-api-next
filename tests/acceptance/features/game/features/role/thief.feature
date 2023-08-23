Feature: 👺 Thief role

  Scenario: 👺 Thief steals the seer role
    Given a created game with additional cards described in file seer-werewolf-additional-cards-for-thief.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | thief    |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | witch    |
    Then the game's current play should be thief to choose-card

    When the thief chooses card with role seer
    Then the player named Antoine should be currently a seer and originally a thief
    And the game's current play should be seer to look