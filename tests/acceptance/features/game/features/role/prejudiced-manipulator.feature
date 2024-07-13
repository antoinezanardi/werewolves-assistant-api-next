@prejudiced-manipulator-role
Feature: 👺 Prejudiced Manipulator role

  Scenario: 👺 Prejudiced Manipulator manages to kill every players in the other group but doesn't win because he's dead
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                   | group |
      | Antoine | prejudiced-manipulator | boy   |
      | Olivia  | werewolf               | boy   |
      | JB      | villager               | boy   |
      | Thomas  | villager               | girl  |
      | Maxime  | villager               | girl  |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | Olivia | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Maxime
    Then the player named Maxime should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be playing

  Scenario: 👺 Prejudiced Manipulator is infected and thus, can't win the game
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                   | group |
      | Antoine | prejudiced-manipulator | boy   |
      | Olivia  | accursed-wolf-father   | boy   |
      | JB      | villager               | boy   |
      | Thomas  | villager               | girl  |
      | Maxime  | villager               | girl  |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be accursed-wolf-father to infect

    When the accursed wolf-father infects the player named Antoine
    Then the player named Antoine should have the active powerless from accursed-wolf-father attribute
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | Olivia | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Maxime
    Then the game's current play should be accursed-wolf-father to infect

    When the player or group skips his turn
    Then the player named Maxime should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be playing

  Scenario: 👺 Prejudiced Manipulator is infected but can still win the game thanks to game options
    Given a created game with options described in file no-sheriff-option.json, prejudiced-manipulator-not-powerless-on-werewolves-side-option.json and with the following players
      | name    | role                   | group |
      | Antoine | prejudiced-manipulator | boy   |
      | Olivia  | accursed-wolf-father   | boy   |
      | JB      | villager               | boy   |
      | Thomas  | villager               | girl  |
      | Maxime  | villager               | girl  |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be accursed-wolf-father to infect

    When the accursed wolf-father infects the player named Antoine
    Then the player named Antoine should not have the active powerless from accursed-wolf-father attribute
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | Olivia | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Maxime
    Then the game's current play should be accursed-wolf-father to infect

    When the player or group skips his turn
    Then the player named Maxime should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be over
    And the game's winners should be prejudiced-manipulator with the following players
      | name    |
      | Antoine |
