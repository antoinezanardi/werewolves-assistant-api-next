@vote-game-play

Feature: 🗳️ Vote Game Play

  Scenario: 🗳 Majority of votes against a player kills him
    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | werewolf |
      | Olivia  | villager |
      | JB      | villager |
      | Thomas  | villager |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target |
      | JB      | Thomas |
      | Thomas  | JB     |
      | Antoine | JB     |
    Then the player named JB should be murdered by survivors from vote

  Scenario: 🗳 Tie in votes are dealt with another vote when there is no sheriff in town
    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | werewolf |
      | Olivia  | villager |
      | JB      | villager |
      | Thomas  | villager |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | JB     | Thomas |
      | Thomas | JB     |
    Then the game's current play should be survivors to vote because previous-votes-were-in-ties

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the player named JB should be alive

  Scenario: 🗳 None of the players are murdered when there is a tie in votes but survivors can't decide who to kill without sheriff
    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | werewolf |
      | Olivia  | villager |
      | JB      | villager |
      | Thomas  | villager |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | JB     | Thomas |
      | Thomas | JB     |
    Then the game's current play should be survivors to vote because previous-votes-were-in-ties

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Thomas |
      | Thomas  | JB     |
    Then the player named Thomas should be alive
    And the player named JB should be alive
    And the game's current play should be werewolves to eat

  Scenario: 🗳 Sheriff has a doubled vote
    Given a created game with the following players
      | name    | role     |
      | Antoine | werewolf |
      | Olivia  | villager |
      | JB      | villager |
      | Thomas  | villager |
    Then the game's current play should be survivors to elect-sheriff

    When the survivors elect sheriff with the following votes
      | voter   | target  |
      | Antoine | Olivia  |
      | Olivia  | Antoine |
      | JB      | Antoine |
      | Thomas  | Antoine |
    Then the player named Antoine should have the active sheriff from survivors attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target |
      | JB      | Thomas |
      | Antoine | JB     |
    Then the player named JB should be murdered by survivors from vote

  Scenario: 🗳 Sheriff disparition in game brings back the classic tie in votes system
    Given a created game with the following players
      | name    | role     |
      | Antoine | idiot    |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | villager |
    Then the game's current play should be survivors to elect-sheriff

    When the survivors elect sheriff with the following votes
      | voter   | target  |
      | Antoine | Olivia  |
      | Olivia  | Antoine |
      | JB      | Antoine |
      | Thomas  | Antoine |
    Then the player named Antoine should have the active sheriff from survivors attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | JB     | Thomas |
      | Thomas | JB     |
    Then the player named JB should be alive
    And the player named Thomas should be alive
    And the game's current play should be survivors to vote because previous-votes-were-in-ties

    When the survivors vote with the following votes
      | voter  | target |
      | Olivia | Thomas |
      | Thomas | JB     |
      | JB     | Thomas |
    Then the player named Thomas should be murdered by survivors from vote

  Scenario: 🗳 Raven mark adds two votes to the player who has it
    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | werewolf |
      | Olivia  | villager |
      | JB      | raven    |
      | Thomas  | villager |
    And the game's current play should be raven to mark

    When the raven marks the player named JB
    Then the player named JB should have the active raven-marked from raven attribute
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | JB     | Thomas |
      | Thomas | JB     |
    Then the player named JB should be murdered by survivors from vote

  Scenario: 🗳 Scapegoat is murdered in case of tie and makes the next votes skipped by banning everyone from voting
    Given a created game with the following players
      | name    | role      |
      | Antoine | werewolf  |
      | Olivia  | villager  |
      | JB      | scapegoat |
      | Thomas  | villager  |
      | Juju    | villager  |
      | Doudou  | villager  |
    Then the game's current play should be survivors to elect-sheriff

    When the survivors elect sheriff with the following votes
      | voter   | target  |
      | Antoine | Olivia  |
      | Olivia  | Antoine |
      | JB      | Antoine |
      | Thomas  | Antoine |
    Then the player named Antoine should have the active sheriff from survivors attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | Doudou | Juju   |
      | Juju   | Doudou |
    Then the player named JB should be murdered by survivors from vote-scapegoated
    And the game's current play should be scapegoat to ban-voting

    When the scapegoat bans from vote the following players
      | name    |
      | Juju    |
      | Doudou  |
      | Antoine |
      | Thomas  |
    Then the game's current play should be werewolves to eat
    And nobody should have the active cant-vote from scapegoat attribute

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be werewolves to eat
    And the game's turn should be 3
    And the game's phase should be night

  Scenario: 🗳 Stuttering Judge asks for another vote after another vote
    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role             |
      | Antoine | werewolf         |
      | Olivia  | villager         |
      | JB      | stuttering-judge |
      | Thomas  | villager         |
    And the game's current play should be stuttering-judge to choose-sign

    When the stuttering judge chooses his sign
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes and the stuttering judge does his sign
      | voter  | target |
      | JB     | Thomas |
      | Thomas | JB     |
    Then the player named JB should be alive
    And the player named Thomas should be alive
    And the game's current play should be survivors to vote because previous-votes-were-in-ties

    When the survivors vote with the following votes
      | voter  | target |
      | JB     | Thomas |
      | Thomas | JB     |
    Then the player named JB should be alive
    And the player named Thomas should be alive
    And the game's current play should be survivors to vote because stuttering-judge-request

    When the survivors vote with the following votes
      | voter | target |
      | JB    | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be werewolves to eat

  Scenario: 🗳 Multiple votes can happen during the day with stuttering judge requests and ties
    Given a created game with options described in files no-sheriff-option.json, stuttering-judge-two-vote-requests-option.json and with the following players
      | name    | role             |
      | Antoine | werewolf         |
      | Olivia  | villager         |
      | JB      | stuttering-judge |
      | Thomas  | villager         |
    And the game's current play should be stuttering-judge to choose-sign

    When the stuttering judge chooses his sign
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes and the stuttering judge does his sign
      | voter  | target |
      | JB     | Thomas |
      | Thomas | JB     |
    Then the player named JB should be alive
    And the player named Thomas should be alive
    And the game's current play should be survivors to vote because previous-votes-were-in-ties

    When the survivors vote with the following votes and the stuttering judge does his sign
      | voter  | target |
      | JB     | Thomas |
      | Thomas | JB     |
    Then the player named JB should be alive
    And the player named Thomas should be alive
    And the game's current play should be survivors to vote because stuttering-judge-request

    When the survivors vote with the following votes
      | voter  | target |
      | JB     | Thomas |
      | Thomas | JB     |
    Then the player named JB should be alive
    And the player named Thomas should be alive
    And the game's current play should be survivors to vote because previous-votes-were-in-ties

    When the survivors vote with the following votes
      | voter | target |
      | JB    | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be survivors to vote because stuttering-judge-request

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat