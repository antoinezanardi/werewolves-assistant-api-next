@vote-game-play

Feature: 🗳️ Vote Game Play

  Scenario: 🗳 Majority of votes against a player kill him
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