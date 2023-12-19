@wild-child-role

Feature: 🐒 Wild Child role

  Scenario: 🐒 Wild Child changes his side when his model dies

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Antoine | wild-child |
      | Olivia  | werewolf   |
      | JB      | villager   |
      | Maxime  | villager   |
    Then the request should have succeeded with status code 201
    And the game's current play should be wild-child to choose-model
    And the player named Antoine should be on villagers current side and originally be on villagers side
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be one-night-only
    And the game's current play can not be skipped
    And the game's current play should have eligible targets boundaries from 1 to 1
    And the game's current play should have the following eligible targets interactable players
      | name   |
      | Olivia |
      | JB     |
      | Maxime |
    And the game's current play eligible targets interactable player named Olivia should have the following interactions
      | source     | interaction     |
      | wild-child | choose-as-model |
    And the game's current play eligible targets interactable player named JB should have the following interactions
      | source     | interaction     |
      | wild-child | choose-as-model |
    And the game's current play eligible targets interactable player named Maxime should have the following interactions
      | source     | interaction     |
      | wild-child | choose-as-model |

    When the wild child chooses the player named Olivia as a model
    Then the request should have succeeded with status code 200
    And the player named Olivia should have the active worshiped from wild-child attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | Maxime | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And the player named Antoine should be on villagers current side and originally be on villagers side
    And the player named Olivia should have the active worshiped from wild-child attribute
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the player named Antoine should be on werewolves current side and originally be on villagers side
    And the player named Olivia should not have the active worshiped from wild-child attribute
    And the game's current play should be werewolves to eat

  Scenario: 🐒 Wild Child can't choose an unknown player

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Antoine | wild-child |
      | Olivia  | werewolf   |
      | JB      | villager   |
      | Maxime  | villager   |
    Then the game's current play should be wild-child to choose-model

    When the player or group targets an unknown player
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🐒 Wild Child can't choose a dead player as a model

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Antoine | wild-child |
      | Olivia  | werewolf   |
      | JB      | villager   |
      | Maxime  | angel      |
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | Maxime | JB     |
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be wild-child to choose-model
    And the game's current play should have the following eligible targets interactable players
      | name   |
      | Olivia |
      | Maxime |

    When the wild child chooses the player named JB as a model
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Wild child can't choose this target as a model"

  Scenario: 🐒 Wild Child can't skip his turn

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Antoine | wild-child |
      | Olivia  | werewolf   |
      | JB      | villager   |
      | Maxime  | villager   |
    Then the game's current play should be wild-child to choose-model

    When the player or group skips his turn
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`targets` is required on this current game's state"

  Scenario: 🐒 Wild Child can't choose multiple targets as models

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Antoine | wild-child |
      | Olivia  | werewolf   |
      | JB      | villager   |
      | Maxime  | villager   |
    Then the game's current play should be wild-child to choose-model

    When the player or group targets the following players
      | target |
      | Olivia |
      | Maxime |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets for this current game's state"

  Scenario: 🐒 Wild Child can't choose himself as a model

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Antoine | wild-child |
      | Olivia  | werewolf   |
      | JB      | villager   |
      | Maxime  | villager   |
    Then the game's current play should be wild-child to choose-model

    When the wild child chooses the player named Antoine as a model
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Wild child can't choose this target as a model"