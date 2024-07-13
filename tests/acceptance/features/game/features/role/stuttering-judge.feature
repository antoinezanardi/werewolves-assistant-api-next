@stuttering-judge-role
Feature: ⚖️ Stuttering Judge Role

  Scenario: ⚖️ Stuttering Judge chooses his sign and can ask for another vote when all voted
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Olivia  | werewolf         |
      | JB      | villager         |
      | Camille | villager         |
      | Thomas  | villager         |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be stuttering-judge to request-another-vote
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play type should be request-another-vote
    And the game's current play occurrence should be consequential
    And the game's current play can be skipped
    And the game's current play source should not have interactions

    When the stuttering judge requests another vote
    And the game's current play should be survivors to vote
    And the game's current play should have the following causes
      | cause                    |
      | stuttering-judge-request |
    And the game's current play type should be vote
    And the game's current play occurrence should be consequential

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

  Scenario: ⚖️ Stuttering Judge can request more votes if options allow him
    Given a created game with options described in file no-sheriff-option.json, stuttering-judge-two-vote-requests-option.json and with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Olivia  | werewolf         |
      | JB      | villager         |
      | Camille | villager         |
      | Thomas  | villager         |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target  |
      | Olivia  | Antoine |
      | Camille | Olivia  |
    And the game's current play should be survivors to vote
    And the game's current play should have the following causes
      | cause                       |
      | previous-votes-were-in-ties |

    When the player or group skips his turn
    Then the game's current play should be stuttering-judge to request-another-vote

    When the stuttering judge requests another vote
    And the game's current play should be survivors to vote
    And the game's current play should have the following causes
      | cause                    |
      | stuttering-judge-request |

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be stuttering-judge to request-another-vote

    When the stuttering judge requests another vote
    And the game's current play should be survivors to vote
    And the game's current play should have the following causes
      | cause                    |
      | stuttering-judge-request |

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

  Scenario: ⚖️ Stuttering Judge can't ask another vote if it's not his turn
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role             |
      | Antoine | villager         |
      | Olivia  | werewolf         |
      | JB      | stuttering-judge |
      | Camille | villager         |
    Then the game's current play should be werewolves to eat

    When the stuttering judge requests another vote
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`doesJudgeRequestAnotherVote` can't be set on this current game's state"

  Scenario: ⚖️ Stuttering Judge can't ask another vote if he is dead
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Olivia  | werewolf         |
      | JB      | angel            |
      | Camille | villager         |
      | Juju    | villager         |
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target  |
      | Olivia | Antoine |
    Then the player named Antoine should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the player named Juju should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

  Scenario: ⚖️ Stuttering Judge can't ask another vote if he is powerless
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Olivia  | werewolf         |
      | JB      | witch            |
      | Camille | elder            |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the game's current play should be witch to use-potions

    When the witch uses death potion on the player named Camille
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat
