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
    And the game should have the following events
      | type              |
      | game-phase-starts |
      | death             |
      | bear-growls       |
      | game-turn-starts  |
    And the game's event with type "bear-growls" should have the following players
      | name    |
      | Antoine |
    And the game's current play should be survivors to bury-dead-bodies

  Scenario: 🐻 Bear Tamer's bear growls when he is infected even if any of his neighbor is a werewolf
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                 |
      | Olivia  | villager             |
      | Antoine | bear-tamer           |
      | JB      | villager             |
      | Thomas  | accursed-wolf-father |
      | Doudou  | villager             |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be accursed-wolf-father to infect

    When the accursed wolf-father infects the player named Antoine
    Then the player named Antoine should be alive
    And the player named Antoine should be on werewolves current side and originally be on villagers side
    And the game should have the following events
      | type                                   |
      | accursed-wolf-father-may-have-infected |
      | game-phase-starts                      |
      | bear-growls                            |
      | game-turn-starts                       |
    And the game's event with type "bear-growls" should have the following players
      | name    |
      | Antoine |
    And the game's current play should be survivors to vote

  Scenario: 🐻 Bear Tamer's bear doesn't growl even if he is infected and any of his neighbor is a werewolf with the right option
    Given a created game with options described in file no-sheriff-option.json, bear-tamer-bear-doesnt-growl-on-werewolves-side-option.json and with the following players
      | name    | role                 |
      | Olivia  | villager             |
      | Antoine | bear-tamer           |
      | JB      | villager             |
      | Thomas  | accursed-wolf-father |
      | Doudou  | villager             |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be accursed-wolf-father to infect

    When the accursed wolf-father infects the player named Antoine
    Then the player named Antoine should be alive
    And the player named Antoine should be on werewolves current side and originally be on villagers side
    And the game's current play should be survivors to vote
    And the game should have the following events
      | type                                   |
      | accursed-wolf-father-may-have-infected |
      | game-phase-starts                      |
      | bear-sleeps                            |
      | game-turn-starts                       |
    And the game's event with type "bear-sleeps" should have the following players
      | name    |
      | Antoine |
    And the game's current play should be survivors to vote

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
    And the game should have the following events
      | type             |
      | death            |
      | game-turn-starts |

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat
