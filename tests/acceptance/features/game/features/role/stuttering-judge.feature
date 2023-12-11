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
    Then the request should have succeeded with status code 201
    And the game's current play should be stuttering-judge to choose-sign
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be one-night-only
    And the game's current play can not be skipped

    When the stuttering judge chooses his sign
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes and the stuttering judge does his sign
      | voter   | target  |
      | Olivia  | Antoine |
      | Camille | Antoine |
    Then the request should have succeeded with status code 200
    And the player named Antoine should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote because stuttering-judge-request
    And the game's current play occurrence should be consequential

  Scenario: ⚖️ Stuttering Judge chooses his sign and can ask for another vote even if all did not vote

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Olivia  | werewolf         |
      | JB      | villager         |
      | Camille | villager         |
      | Thomas  | villager         |
    Then the game's current play should be stuttering-judge to choose-sign
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the stuttering judge chooses his sign
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When nobody vote and the stuttering judge does his sign
    Then the game's current play should be survivors to vote because stuttering-judge-request

  Scenario: ⚖️ Stuttering Judge can request more votes if options allow him

    Given a created game with options described in file no-sheriff-option.json, stuttering-judge-two-vote-requests-option.json and with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Olivia  | werewolf         |
      | JB      | villager         |
      | Camille | villager         |
      | Thomas  | villager         |
    Then the game's current play should be stuttering-judge to choose-sign
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the stuttering judge chooses his sign
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes and the stuttering judge does his sign
      | voter   | target  |
      | Olivia  | Antoine |
      | Camille | Olivia  |
    Then the game's current play should be survivors to vote because previous-votes-were-in-ties

    When nobody vote and the stuttering judge does his sign
    Then the game's current play should be survivors to vote because stuttering-judge-request

    When the player or group skips his turn
    Then the game's current play should be survivors to vote because stuttering-judge-request

  Scenario: ⚖️ Stuttering Judge can't ask another vote if he didn't make his sign yet

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Olivia  | werewolf         |
      | JB      | angel            |
      | Camille | villager         |
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes and the stuttering judge does his sign
      | voter   | target  |
      | Olivia  | Antoine |
      | Camille | Olivia  |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`doesJudgeRequestAnotherVote` can't be set on this current game's state"

  Scenario: ⚖️ Stuttering Judge can't ask another vote if he is not in the game

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | JB      | villager |
      | Camille | villager |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes and the stuttering judge does his sign
      | voter   | target  |
      | Olivia  | Antoine |
      | Camille | Olivia  |
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
      | Olivia | Camille |
    Then the player named Camille should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be stuttering-judge to choose-sign

    When the stuttering judge chooses his sign
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes and the stuttering judge does his sign
      | voter  | target |
      | Olivia | JB     |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`doesJudgeRequestAnotherVote` can't be set on this current game's state"

  Scenario: ⚖️ Stuttering Judge can't ask another vote if he is powerless

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Olivia  | werewolf         |
      | JB      | witch            |
      | Camille | elder            |
    Then the game's current play should be stuttering-judge to choose-sign

    When the stuttering judge chooses his sign
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the game's current play should be witch to use-potions

    When the witch uses death potion on the player named Camille
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes and the stuttering judge does his sign
      | voter  | target  |
      | Olivia | Antoine |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`doesJudgeRequestAnotherVote` can't be set on this current game's state"

  Scenario: ⚖️ Stuttering Judge can't ask another vote if he used all of his requests

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Olivia  | werewolf         |
      | JB      | villager         |
      | Camille | villager         |
    Then the game's current play should be stuttering-judge to choose-sign

    When the stuttering judge chooses his sign
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When nobody vote and the stuttering judge does his sign
    Then the game's current play should be survivors to vote because stuttering-judge-request

    When nobody vote and the stuttering judge does his sign
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`doesJudgeRequestAnotherVote` can't be set on this current game's state"

  Scenario: ⚖️ Stuttering Judge can't ask another vote if it is not during a vote action

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Olivia  | werewolf         |
      | JB      | scandalmonger    |
      | Camille | villager         |
    Then the game's current play should be stuttering-judge to choose-sign

    When the stuttering judge chooses his sign
    Then the game's current play should be scandalmonger to mark

    When nobody vote and the stuttering judge does his sign
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "`doesJudgeRequestAnotherVote` can't be set on this current game's state"