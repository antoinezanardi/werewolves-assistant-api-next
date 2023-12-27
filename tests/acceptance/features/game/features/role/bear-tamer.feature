@bear-tamer-role

Feature: 🐻 Bear Tamer role

  Scenario: 🐻 Bear Tamer's bear growls when one of his neighbor is a werewolf and doesn't growl when no neighbor is a werewolf

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Olivia  | villager   |
      | Antoine | bear-tamer |
      | JB      | villager   |
      | Thomas  | werewolf   |
      | Doudou  | villager   |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Doudou
    Then the player named Doudou should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be bear-tamer to growl

    When the bear tamer calms his bear
    Then the request should have succeeded with status code 200
    And the game's current play should be survivors to vote

  Scenario: 🐻 Bear Tamer's bear growls when he is infected even if any of his neighbor is a werewolf

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                 |
      | Olivia  | villager             |
      | Antoine | bear-tamer           |
      | JB      | villager             |
      | Thomas  | accursed-wolf-father |
      | Doudou  | villager             |
    Then the game's current play should be werewolves to eat

    When the accursed wolf-father infects the player named Antoine
    Then the player named Antoine should be alive
    And the player named Antoine should be on werewolves current side and originally be on villagers side
    And the game's current play should be bear-tamer to growl

  Scenario: 🐻 Bear Tamer's bear doesn't growl even if he is infected and any of his neighbor is a werewolf with the right option

    Given a created game with options described in file no-sheriff-option.json, bear-tamer-bear-doesnt-growl-on-werewolves-side-option.json and with the following players
      | name    | role                 |
      | Olivia  | villager             |
      | Antoine | bear-tamer           |
      | JB      | villager             |
      | Thomas  | accursed-wolf-father |
      | Doudou  | villager             |
    Then the game's current play should be werewolves to eat

    When the accursed wolf-father infects the player named Antoine
    Then the player named Antoine should be alive
    And the player named Antoine should be on werewolves current side and originally be on villagers side
    And the game's current play should be survivors to vote

  Scenario: 🐻 Bear Tamer's bear doesn't growl first because he didn't have any werewolf neighbor but growls because he has one after the multiple buries

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Olivia  | villager   |
      | Antoine | bear-tamer |
      | JB      | villager   |
      | Maxime  | werewolf   |
      | Thomas  | hunter     |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be hunter to shoot

    When the hunter shoots at the player named Olivia
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be bear-tamer to growl

    When the bear tamer calms his bear
    Then the request should have succeeded with status code 200

  Scenario: 🐻 Bear Tamer's bear doesn't growl when the votes have been made and a werewolf becomes his neighbor

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Olivia  | villager   |
      | Antoine | bear-tamer |
      | Juju    | villager   |
      | JB      | villager   |
      | Maxime  | werewolf   |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | Olivia | JB     |
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat