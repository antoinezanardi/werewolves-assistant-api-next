@angel-role

Feature: 👼 Angel role

  Scenario: 👼 Angel doesn't win because he is powerless

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | angel    |
      | Olivia  | elder    |
      | JB      | villager |
      | Thomas  | werewolf |
    Then the request should have succeeded with status code 201
    And the game's phase name should be twilight
    And the game's current play should be survivors to vote
    And the game's current play should have the following causes
      | cause          |
      | angel-presence |
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | Olivia  |
      | JB      |
      | Thomas  |
    And the game's current play type should be vote
    And the game's current play occurrence should be one-night-only
    And the game's current play can not be skipped
    And the game's current play source should have the following interactions
      | type | source    | minBoundary | maxBoundary |
      | vote | survivors | 1           | 4           |
    And the game's current play source interaction with type vote should have the following eligible targets
      | name    |
      | Antoine |
      | Olivia  |
      | JB      |
      | Thomas  |

    When the survivors vote with the following votes
      | source  | vote   |
      | Antoine | Olivia |
      | JB      | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies
    And the game's phase name should be twilight

    When the survivors bury dead bodies
    Then 2 of the following players should have the active powerless from elder attribute
      | name    |
      | Antoine |
      | JB      |
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's status should be playing

  Scenario: 👼 Angel doesn't win if he dies from the hunter on twilight

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | angel    |
      | Olivia  | hunter   |
      | JB      | villager |
      | Thomas  | werewolf |
    And the game's current play should be survivors to vote
    And the game's current play should have the following causes
      | cause          |
      | angel-presence |
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | Olivia  |
      | JB      |
      | Thomas  |

    When the survivors vote with the following votes
      | source  | vote   |
      | Antoine | Olivia |
      | JB      | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And the game's phase name should be twilight
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be hunter to shoot
    And the game's phase name should be twilight

    When the hunter shoots at the player named Antoine
    Then the player named Antoine should be murdered by hunter from shot
    And the game's phase name should be twilight
    And the game's status should be playing
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat
    And the game's phase name should be night
    And the game's status should be playing

  Scenario: 👼 Angel doesn't win if he is murdered on the second vote

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | angel    |
      | Olivia  | villager |
      | JB      | villager |
      | Thomas  | werewolf |
    And the game's current play should be survivors to vote
    And the game's current play should have the following causes
      | cause          |
      | angel-presence |
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | Olivia  |
      | JB      |
      | Thomas  |

    When the survivors vote with the following votes
      | source  | vote   |
      | Antoine | Olivia |
      | JB      | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | vote    |
      | Thomas | Antoine |
    Then the player named Antoine should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be over
    But the game's winners should be werewolves with the following players
      | name   |
      | Thomas |

  Scenario: 👼 Angel wins if he is murdered on the stuttering judge requested vote after the first vote

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role             |
      | Antoine | angel            |
      | Olivia  | villager         |
      | JB      | villager         |
      | Thomas  | werewolf         |
      | Max     | stuttering-judge |
    And the game's current play should be survivors to vote
    And the game's current play should have the following causes
      | cause          |
      | angel-presence |
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | Olivia  |
      | JB      |
      | Thomas  |
      | Max     |

    When the survivors vote with the following votes
      | source  | vote   |
      | Antoine | Olivia |
      | JB      | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be stuttering-judge to request-another-vote

    When the stuttering judge requests another vote
    And the game's current play should be survivors to vote
    And the game's current play should have the following causes
      | cause                    |
      | stuttering-judge-request |

    When the survivors vote with the following votes
      | source | vote    |
      | Thomas | Antoine |
    Then the player named Antoine should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be over
    And the game's winners should be angel with the following players
      | name    |
      | Antoine |