@rusty-sword-knight-role

Feature: 🤺 Rusty Sword Knight role

  Scenario: 🤺 Rusty Sword Knight kills the first alive werewolf on his left when he died at the end of the day

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role               |
      | Antoine | rusty-sword-knight |
      | JB      | werewolf           |
      | Olivia  | werewolf           |
      | Thomas  | villager           |
      | Babou   | werewolf           |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the player named Babou should not have the active contaminated from rusty-sword-knight attribute
    And the player named Babou should be alive
    And the game's current play should be survivors to bury-dead-bodies
    And the game's current play should not have eligible targets
    And the game's current play can be skipped

    When the survivors bury dead bodies
    Then the player named Babou should have the active contaminated from rusty-sword-knight attribute
    And the player named Babou should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the player named Babou should be murdered by rusty-sword-knight from disease

  Scenario: 🤺 Rusty Sword Knight doesn't kill the left werewolf if he's already dead

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role               |
      | Antoine | rusty-sword-knight |
      | JB      | werewolf           |
      | Olivia  | werewolf           |
      | Thomas  | villager           |
      | Babou   | werewolf           |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the player named Babou should not have the active contaminated from rusty-sword-knight attribute
    And the player named Babou should be alive
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the player named Babou should have the active contaminated from rusty-sword-knight attribute
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | Thomas | Babou  |
    Then the player named Babou should be murdered by survivors from vote
    And the player named Olivia should be alive
    And the player named JB should be alive

  Scenario: 🤺 Rusty Sword Knight doesn't kill the left werewolf if he's powerless when he's been eaten

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role               |
      | Antoine | rusty-sword-knight |
      | JB      | werewolf           |
      | Olivia  | elder              |
      | Thomas  | angel              |
      | Babou   | werewolf           |
    Then the game's current play should be survivors to vote because angel-presence

    When the survivors vote with the following votes
      | voter  | target |
      | Thomas | Olivia |
    Then the player named Antoine should not have the active powerless from elder attribute
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the player named Antoine should have the active powerless from elder attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the player named Babou should not have the active contaminated from rusty-sword-knight attribute