@prejudiced-manipulator-role

Feature: 👺 Prejudiced Manipulator role

  Scenario: 👺 Prejudiced Manipulator manages to kill every players in the other group but doesn't win because he's dead

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                   | group |
      | Antoine | prejudiced-manipulator | boy   |
      | Olivia  | werewolf               | boy   |
      | JB      | villager               | boy   |
      | Thomas  | villager               | girl  |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat