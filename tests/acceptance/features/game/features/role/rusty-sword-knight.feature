@rusty-sword-knight-role

Feature: 🤺 Rusty Sword Knight role

  Scenario: 🤺 Rusty Sword Knight kills the first alive werewolf on his left when he died at the end of the day

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | rusty-sword-knight    |
      | JB      | werewolf              |
      | Olivia  | vile-father-of-wolves |
      | Thomas  | villager              |
      | Babou   | werewolf              |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the player named Babou should have the active contaminated from rusty-sword-knight attribute
    And the player named Babou should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the player named Babou should be murdered by rusty-sword-knight from disease

  Scenario: 🤺 Rusty Sword Knight doesn't kill the left werewolf if he's already dead

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | rusty-sword-knight    |
      | JB      | werewolf              |
      | Olivia  | vile-father-of-wolves |
      | Thomas  | villager              |
      | Babou   | werewolf              |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the player named Babou should have the active contaminated from rusty-sword-knight attribute
    And the player named Babou should be alive
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | Thomas | Babou  |
    Then the player named Babou should be murdered by survivors from vote
    And the player named Olivia should be alive
    And the player named JB should be alive