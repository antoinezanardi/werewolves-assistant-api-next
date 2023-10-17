@thief-role

Feature: 👺 Thief role

  Scenario: 👺 Thief steals the seer role

    Given a created game with additional cards described in file seer-werewolf-additional-cards-for-thief.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | thief    |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | witch    |
    Then the game's current play should be thief to choose-card
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be first-night-only
    And the game's current play can be skipped

    When the thief chooses card with role seer
    Then the player named Antoine should be currently a seer and originally a thief
    And the game's current play should be seer to look

    When the seer looks at the player named Olivia
    Then the player named Olivia should have the active seen from seer attribute
    And the game's current play should be werewolves to eat

  Scenario: 👺 Thief can skip his turn if he wants

    Given a created game with additional cards described in file seer-werewolf-additional-cards-for-thief.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | thief    |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | witch    |
    Then the game's current play should be thief to choose-card
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play can be skipped

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

  Scenario: 👺 Thief can't skip his turn if all his cards are werewolves

    Given a created game with additional cards described in file full-werewolves-additional-cards-for-thief.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | thief    |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | witch    |
    Then the game's current play should be thief to choose-card
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play can not be skipped

  Scenario: 👺 Thief can skip his turn if he wants even if all his cards are werewolves with good option

    Given a created game with additional cards described in file full-werewolves-additional-cards-for-thief.json and with options described in file no-sheriff-option.json, thief-can-skip-even-with-full-werewolves-option.json and with the following players
      | name    | role     |
      | Antoine | thief    |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | witch    |
    Then the game's current play should be thief to choose-card
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play can be skipped

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

  Scenario: 👺 Thief can choose between more than two cards with good options

    Given a created game with additional cards described in file five-additional-cards-for-thief.json and with options described in file no-sheriff-option.json, thief-has-five-additional-cards-option.json and with the following players
      | name    | role     |
      | Antoine | thief    |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | witch    |
    Then the game's current play should be thief to choose-card

    When the thief chooses card with role white-werewolf
    Then the player named Antoine should be currently a white-werewolf and originally a thief
    And the player named Antoine should be on werewolves current side and originally be on villagers side
    And the game's current play should be werewolves to eat