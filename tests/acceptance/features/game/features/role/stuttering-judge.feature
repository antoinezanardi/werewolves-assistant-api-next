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
    Then the game's current play should be stuttering-judge to choose-sign

    When the stuttering judge chooses his sign
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes and the stuttering judge does his sign
      | voter   | target  |
      | Olivia  | Antoine |
      | Camille | Antoine |
    Then the player named Antoine should be murdered by survivors from vote
    And the game's current play should be survivors to vote because stuttering-judge-request


  Scenario: ⚖️ Stuttering Judge chooses his sign and can ask for another vote even if all did not vote
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Olivia  | werewolf         |
      | JB      | villager         |
      | Camille | villager         |
      | Thomas  | villager         |
    Then the game's current play should be stuttering-judge to choose-sign

    When the stuttering judge chooses his sign
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

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

    When the stuttering judge chooses his sign
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes and the stuttering judge does his sign
      | voter   | target  |
      | Olivia  | Antoine |
      | Camille | Olivia  |
    Then the game's current play should be survivors to vote because previous-votes-were-in-ties

    When nobody vote and the stuttering judge does his sign
    Then the game's current play should be survivors to vote because stuttering-judge-request

    When the player or group skips his turn
    Then the game's current play should be survivors to vote because stuttering-judge-request