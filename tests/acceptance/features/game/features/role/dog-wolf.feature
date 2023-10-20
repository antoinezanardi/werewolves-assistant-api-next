@dog-wolf-role

Feature: 🐶 Dog Wolf role

  Scenario: 🐶 Dog Wolf chooses the villagers side

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | dog-wolf |
      | Benoit  | villager |
      | Cecile  | villager |
      | David   | werewolf |
    Then the request should have succeeded with status code 201
    And the game's current play should be dog-wolf to choose-side
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the player named Antoine should be on villagers current side and originally be on villagers side
    And the game's current play occurrence should be first-night-only
    And the game's current play can not be skipped

    When the dog wolf chooses the villagers side
    Then the request should have succeeded with status code 200
    And the player named Antoine should be on villagers current side and originally be on villagers side

  Scenario: 🐶 Dog Wolf chooses the werewolves side

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | dog-wolf |
      | Benoit  | villager |
      | Cecile  | villager |
      | David   | werewolf |
    Then the game's current play should be dog-wolf to choose-side
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the player named Antoine should be on villagers current side and originally be on villagers side

    When the dog wolf chooses the werewolves side
    Then the player named Antoine should be on werewolves current side and originally be on villagers side

  Scenario: 🐶 Dog Wolf can't skip his turn

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | dog-wolf |
      | Benoit  | villager |
      | Cecile  | villager |
      | David   | werewolf |
    Then the game's current play should be dog-wolf to choose-side

    When the player or group skips his turn
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`chosenSide` is required on this current game's state"

  Scenario: 🐶 Dog Wolf can't choose an unknown side

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | dog-wolf |
      | Benoit  | villager |
      | Cecile  | villager |
      | David   | werewolf |
    Then the game's current play should be dog-wolf to choose-side
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the player named Antoine should be on villagers current side and originally be on villagers side

    When the dog wolf chooses the unknown side
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"