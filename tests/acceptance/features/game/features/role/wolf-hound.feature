@wolf-hound-role

Feature: 🐶 Wolf-Hound role

  Scenario: 🐶 Wolf-Hound chooses the villagers side

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Antoine | wolf-hound |
      | Benoit  | villager   |
      | Cecile  | villager   |
      | David   | werewolf   |
    Then the request should have succeeded with status code 201
    And the game's current play should be wolf-hound to choose-side
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the player named Antoine should be on villagers current side and originally be on villagers side
    And the game's current play type should be choose-side
    And the game's current play occurrence should be one-night-only
    And the game's current play can not be skipped
    And the game's current play source should not have interactions

    When the wolf-hound chooses the villagers side
    Then the request should have succeeded with status code 200
    And the player named Antoine should be on villagers current side and originally be on villagers side

  Scenario: 🐶 Wolf-Hound chooses the werewolves side

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Antoine | wolf-hound |
      | Benoit  | villager   |
      | Cecile  | villager   |
      | David   | werewolf   |
    Then the game's current play should be wolf-hound to choose-side
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the player named Antoine should be on villagers current side and originally be on villagers side

    When the wolf-hound chooses the werewolves side
    Then the player named Antoine should be on werewolves current side and originally be on villagers side

  Scenario: 🐶 Wolf-Hound side is randomly chosen if no choice is made with good option

    When a created game with options described in file no-sheriff-option.json, wolf-hound-side-randomly-chosen-option.json and with the following players
      | name    | role       |
      | Antoine | wolf-hound |
      | Benoit  | villager   |
      | Cecile  | villager   |
      | David   | werewolf   |
    Then the game's current play should be wolf-hound to choose-side
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the player named Antoine should be on villagers current side and originally be on villagers side

    When the player or group skips his turn
    Then the request should have succeeded with status code 200

  Scenario: 🐶 Wolf-Hound can't skip his turn

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Antoine | wolf-hound |
      | Benoit  | villager   |
      | Cecile  | villager   |
      | David   | werewolf   |
    Then the game's current play should be wolf-hound to choose-side

    When the player or group skips his turn
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`chosenSide` is required on this current game's state"

  Scenario: 🐶 Wolf-Hound can't choose an unknown side

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Antoine | wolf-hound |
      | Benoit  | villager   |
      | Cecile  | villager   |
      | David   | werewolf   |
    Then the game's current play should be wolf-hound to choose-side
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the player named Antoine should be on villagers current side and originally be on villagers side

    When the wolf-hound chooses the unknown side
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"

  Scenario: 🐶 Wolf-Hound can't choose a side if it must be randomly chosen

    When a created game with options described in file no-sheriff-option.json, wolf-hound-side-randomly-chosen-option.json and with the following players
      | name    | role       |
      | Antoine | wolf-hound |
      | Benoit  | villager   |
      | Cecile  | villager   |
      | David   | werewolf   |
    Then the game's current play should be wolf-hound to choose-side
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the player named Antoine should be on villagers current side and originally be on villagers side

    When the wolf-hound chooses the villagers side
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`chosenSide` can't be set on this current game's state"