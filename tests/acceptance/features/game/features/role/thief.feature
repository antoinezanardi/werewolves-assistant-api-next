@thief-role

Feature: 👺 Thief role

  Scenario: 👺 Thief steals the seer role

    Given a created game with additional cards described in file seer-werewolf-additional-cards-for-thief.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | thief    |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | witch    |
    Then the request should have succeeded with status code 201
    And the game's current play should be thief to choose-card
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play type should be choose-card
    And the game's current play occurrence should be one-night-only
    And the game's current play can be skipped
    And the game's current play source should not have interactions

    When the thief chooses card with role seer
    Then the player named Antoine should be currently a seer and originally a thief
    And the game's additional card with role seer for thief should be used
    And the game's additional card with role werewolf for thief should not be used
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
    Then the game's additional card with role seer for thief should not be used
    And the game's additional card with role werewolf for thief should not be used
    And the game's current play should be werewolves to eat

  Scenario: 👺 Thief can't steal an unknown card

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

    When the thief chooses an unknown card
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Additional card with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Chosen card is not in the game additional cards"

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

    When the player or group skips his turn
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Thief must choose a card (`chosenCard`)"

  Scenario: 👺 Thief can't choose a card for actor

    Given a created game with additional cards described in file valid-additional-cards-for-thief-and-actor.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | actor    |
      | Olivia  | thief    |
      | JB      | werewolf |
      | Thomas  | villager |
      | Louise  | villager |
    Then the game's current play should be thief to choose-card

    When the thief chooses card with role hunter
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Chosen card is not for thief"

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