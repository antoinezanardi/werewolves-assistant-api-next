@hunter-role

Feature: 🔫 Hunter role

  Scenario: 🔫 Hunter shoots at someone when he dies

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | hunter   |
      | Olivia  | werewolf |
      | JB      | villager |
      | Maxime  | villager |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be hunter to shoot
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be consequential
    And the game's current play can not be skipped
    And the game's current play source should have the following interactions
      | type  | source | minBoundary | maxBoundary |
      | shoot | hunter | 1           | 1           |
    And the game's current play source interaction with type shoot should have the following eligible targets
      | name   |
      | Olivia |
      | JB     |
      | Maxime |

    When the hunter shoots at the player named Olivia
    Then the request should have succeeded with status code 200
    And the player named Olivia should be murdered by hunter from shot

  Scenario: 🔫 Hunter doesn't shoot if he's powerless

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | hunter   |
      | Olivia  | werewolf |
      | JB      | angel    |
      | Maxime  | elder    |
    Then the game's current play should be survivors to vote because angel-presence

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Maxime |
    Then the player named Maxime should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

  Scenario: 🔫 Hunter can't shoot at an unknown player

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | hunter   |
      | Olivia  | werewolf |
      | JB      | villager |
      | Maxime  | villager |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be hunter to shoot

    When the player or group targets an unknown player
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🔫 Hunter can't shoot at a dead player

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | hunter   |
      | Olivia  | werewolf |
      | JB      | villager |
      | Maxime  | villager |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target  |
      | Olivia | Antoine |
    Then the player named Antoine should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be hunter to shoot

    When the hunter shoots at the player named JB
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Hunter can't shoot this target"

  Scenario: 🔫 Hunter can't shoot at multiple targets

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | hunter   |
      | Olivia  | werewolf |
      | JB      | villager |
      | Maxime  | villager |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be hunter to shoot

    When the player or group targets the following players
      | name   |
      | Olivia |
      | JB     |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets for this current game's state"

  Scenario: 🔫 Hunter can't skip his turn

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | hunter   |
      | Olivia  | werewolf |
      | JB      | villager |
      | Maxime  | villager |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be hunter to shoot

    When the player or group skips his turn
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`targets` is required on this current game's state"

  Scenario: 🔫 Hunter is not called if there are no survivors

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | hunter   |
      | Olivia  | werewolf |
      | JB      | cupid    |
      | Maxime  | witch    |
    Then the game's current play should be cupid to charm

    When the cupid shoots an arrow at the player named Antoine and the player named Olivia
    Then the game's current play should be lovers to meet-each-other

    When the lovers meet each other
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Maxime
    Then the game's current play should be witch to use-potions

    When the witch uses death potion on the player named Antoine
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be over