@angel-role

Feature: 👼 Angel role

  Scenario: 👼 Angel doesn't win because he is powerless

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | angel    |
      | Olivia  | ancient  |
      | JB      | villager |
      | Thomas  | werewolf |
    Then the request should have succeeded with status code 201
    And the game's current play should be survivors to vote because angel-presence
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | Olivia  |
      | JB      |
      | Thomas  |
    And the game's current play occurrence should be first-night-only
    And the game's current play can not be skipped
    And the game's current play should not have eligible targets boundaries

    When the survivors vote with the following votes
      | source  | vote   |
      | Antoine | Olivia |
      | JB      | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And 2 of the following players should have the active powerless from ancient attribute
      | name    |
      | Antoine |
      | JB      |
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's status should be playing

  Scenario: 👼 Angel doesn't win if he is murdered on the second vote

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | angel    |
      | Olivia  | villager |
      | JB      | villager |
      | Thomas  | werewolf |
    Then the game's current play should be survivors to vote because angel-presence
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
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | source | vote    |
      | Thomas | Antoine |
    Then the player named Antoine should be murdered by survivors from vote
    And the game's status should be over
    But the game's winners should be werewolves with the following players
      | name   |
      | Thomas |

  Scenario: 👼 Angel doesn't win if he is murdered on the stuttering judge requested vote on first day

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role             |
      | Antoine | angel            |
      | Olivia  | villager         |
      | JB      | villager         |
      | Thomas  | werewolf         |
      | Max     | stuttering-judge |
    Then the game's current play should be survivors to vote because angel-presence
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

    When the stuttering judge chooses his sign
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes and the stuttering judge does his sign
      | source | vote |
      | Thomas | Max  |
    Then the player named Max should be murdered by survivors from vote
    And the game's current play should be survivors to vote because stuttering-judge-request

    When the survivors vote with the following votes
      | source | vote    |
      | Thomas | Antoine |
    Then the player named Antoine should be murdered by survivors from vote
    And the game's status should be over
    But the game's winners should be werewolves with the following players
      | name   |
      | Thomas |