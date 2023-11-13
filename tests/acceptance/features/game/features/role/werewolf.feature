@werewolf-role

Feature: 🐺 Werewolf role

  Scenario: 🐺 Werewolves eat a player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | villager              |
      | Juju    | witch                 |
      | Doudou  | vile-father-of-wolves |
      | Thom    | werewolf              |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name   |
      | Doudou |
      | Thom   |
    And the game's current play occurrence should be on-nights
    And the game's current play can not be skipped
    And the game's current play should have eligible targets boundaries from 1 to 1
    And the game's current play should have the following eligible targets interactable players
      | name    |
      | Antoine |
      | Juju    |
    And the game's current play eligible targets interactable player named Antoine should have the following interactions
      | source     | interaction |
      | werewolves | eat         |
    And the game's current play eligible targets interactable player named Juju should have the following interactions
      | source     | interaction |
      | werewolves | eat         |

    When the werewolves eat the player named Juju
    Then the request should have succeeded with status code 200
    And the player named Juju should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the player named Juju should be murdered by werewolves from eaten

  Scenario: 🐺 Werewolves can't eat an unknown player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | villager              |
      | Juju    | witch                 |
      | Doudou  | vile-father-of-wolves |
      | Thom    | werewolf              |
    Then the game's current play should be werewolves to eat

    When the player or group targets an unknown player
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🐺 Werewolves can't eat a dead player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Juju    | villager |
      | Doudou  | angel    |
      | Thom    | werewolf |
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | name   | vote    |
      | Juju   | Antoine |
      | Doudou | Antoine |
      | Thom   | Antoine |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Werewolves can't eat this target"

  Scenario: 🐺 Werewolves can't eat another wolf

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | villager              |
      | Juju    | villager              |
      | Doudou  | vile-father-of-wolves |
      | Thom    | werewolf              |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thom
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Werewolves can't eat this target"

  Scenario: 🐺 Werewolves can't skip their turn

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | villager              |
      | Juju    | villager              |
      | Doudou  | vile-father-of-wolves |
      | Thom    | werewolf              |
    Then the game's current play should be werewolves to eat

    When the player or group skips his turn
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`targets` is required on this current game's state"

  Scenario: 🐺 Werewolves can't eat multiple targets at once

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | villager              |
      | Juju    | villager              |
      | Doudou  | vile-father-of-wolves |
      | Thom    | werewolf              |
    Then the game's current play should be werewolves to eat

    When the player or group targets the following players
      | name    |
      | Doudou  |
      | Antoine |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets for this current game's state"