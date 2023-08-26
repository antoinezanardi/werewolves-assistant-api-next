@angel-role
Feature: 👼 Angel role

  Scenario: 👼 Angel doesn't win because he is powerless

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | angel    |
      | Olivia  | ancient  |
      | JB      | villager |
      | Thomas  | werewolf |
    Then the game's current play should be all to vote because angel-presence

    When all vote with the following votes
      | source  | vote   |
      | Antoine | Olivia |
      | JB      | Olivia |
    Then the player named Olivia should be murdered by all from vote
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
    Then the game's current play should be all to vote because angel-presence

    When all vote with the following votes
      | source  | vote   |
      | Antoine | Olivia |
      | JB      | Olivia |
    Then the player named Olivia should be murdered by all from vote
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be all to vote

    When all vote with the following votes
      | source | vote    |
      | Thomas | Antoine |
    Then the player named Antoine should be murdered by all from vote
    And the game's status should be over
    But the game's winners should be werewolves with the following players
      | name   |
      | Thomas |