@vile-father-of-wolves-role

Feature: 🐺 Vile Father of Wolves role

  Scenario: 🐺 Vile Father of Wolves infects a player instead of eating it

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | vile-father-of-wolves |
      | Olivia  | seer                  |
      | JB      | villager              |
      | Thomas  | villager              |
    Then the game's current play should be seer to look

    When the seer looks at the player named Antoine
    Then the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the vile father of wolves infects the player named Olivia
    Then the request should have succeeded with status code 200
    And the player named Olivia should be on werewolves current side and originally be on villagers side
    And the player named Olivia should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be seer to look

  Scenario: 🐺 Vile Father of Wolves doesn't infect the ancient if he still have lives

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | vile-father-of-wolves |
      | Olivia  | ancient               |
      | JB      | villager              |
      | Thomas  | villager              |
    Then the game's current play should be werewolves to eat

    When the vile father of wolves infects the player named Olivia
    Then the player named Olivia should be on villagers current side and originally be on villagers side
    And the player named Olivia should be alive

  Scenario: 🐺 Vile Father of Wolves infects the ancient if he only has one life left

    Given a created game with options described in files no-sheriff-option.json, ancient-one-life-against-werewolves-option.json and with the following players
      | name    | role                  |
      | Antoine | vile-father-of-wolves |
      | Olivia  | ancient               |
      | JB      | villager              |
      | Thomas  | villager              |
    Then the game's current play should be werewolves to eat

    When the vile father of wolves infects the player named Olivia
    Then the player named Olivia should be on werewolves current side and originally be on villagers side
    And the player named Olivia should be alive

  Scenario: 🐺 Vile Father of Wolves can't infect if he's not in the game

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role     |
      | Olivia  | ancient  |
      | JB      | villager |
      | Thomas  | villager |
      | Antoine | werewolf |
    Then the game's current play should be werewolves to eat

    When the vile father of wolves infects the player named Olivia
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`targets.isInfected` can't be set on this current game's state"

  Scenario: 🐺 Vile Father of Wolves can't infect if he's dead

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | vile-father-of-wolves |
      | Olivia  | angel                 |
      | JB      | werewolf              |
      | Thomas  | villager              |
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | against |
      | Olivia | Antoine |
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the vile father of wolves infects the player named Thomas
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`targets.isInfected` can't be set on this current game's state"

  Scenario: 🐺 Vile Father of Wolves can't infect if it's not werewolves turn

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | vile-father-of-wolves |
      | Olivia  | raven                 |
      | JB      | werewolf              |
      | Thomas  | villager              |
    Then the game's current play should be raven to mark

    When the vile father of wolves infects the player named Olivia
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`targets.isInfected` can't be set on this current game's state"

  Scenario: 🐺 Vile Father of Wolves can't infect multiple times

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | vile-father-of-wolves |
      | Olivia  | villager              |
      | JB      | villager              |
      | Thomas  | villager              |
    Then the game's current play should be werewolves to eat

    When the vile father of wolves infects the player named Olivia
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the vile father of wolves infects the player named Thomas
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`targets.isInfected` can't be set on this current game's state"

  Scenario: 🐺 Vile Father of Wolves can't infect multiple targets at once

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | vile-father-of-wolves |
      | Olivia  | villager              |
      | JB      | villager              |
      | Thomas  | villager              |
    Then the game's current play should be werewolves to eat

    When the vile father of wolves infects the following players
      | name   |
      | Olivia |
      | Thomas |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets for this current game's state"