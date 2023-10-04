@game-history

Feature: 📜 Game History

  Scenario: 📜 Game's tick, phase and turn are recorded in the game history

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Juju    | villager |
      | Doudou  | werewolf |
      | JB      | villager |
      | Thomas  | villager |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    And the most recent history record is retrieved
    Then the game's tick from the previous history record should be 1
    And the game's phase from the previous history record should be night
    And the game's turn from the previous history record should be 1
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | name   | vote   |
      | JB     | Juju   |
      | Juju   | Doudou |
      | Doudou | Juju   |
    And the most recent history record is retrieved
    Then the game's tick from the previous history record should be 2
    And the game's phase from the previous history record should be day
    And the game's turn from the previous history record should be 1
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    And the most recent history record is retrieved
    Then the game's tick from the previous history record should be 3
    And the game's phase from the previous history record should be night
    And the game's turn from the previous history record should be 2

  Scenario: 📜 Targets of various roles actions are recorded in the game history

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | seer     |
      | Juju    | witch    |
      | Doudou  | werewolf |
      | JB      | guard    |
      | Thomas  | raven    |
    Then the game's current play should be seer to look

    When the seer looks at the player named Juju
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be the following players
      | name |
      | Juju |
    And the game's current play should be raven to mark

    When the player or group skips his turn
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be undefined
    And the game's current play should be guard to protect

    When the guard protects the player named JB
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be the following players
      | name |
      | JB   |
    And the play's votes from the previous history record should be undefined
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be the following players
      | name    |
      | Antoine |
    And the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Antoine and death potion on the player named JB
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be the following players
      | name    |
      | Antoine |
      | JB      |
    And the play's target named Antoine from the previous history record should have drunk the life potion
    And the play's target named JB from the previous history record should have drunk the death potion

  Scenario: 📜 Votes of various roles actions are recorded in the game history

    Given a created game with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Juju    | idiot            |
      | Doudou  | villager         |
      | JB      | werewolf         |
      | Thomas  | villager         |
      | Morgan  | villager         |
    Then the game's current play should be survivors to elect-sheriff

    When the survivors elect sheriff with the following votes
      | name   | vote   |
      | JB     | Juju   |
      | Juju   | Doudou |
      | Doudou | Juju   |
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be the following votes
      | name   | vote   |
      | JB     | Juju   |
      | Juju   | Doudou |
      | Doudou | Juju   |
    And the play's voting result from the previous history record should be sheriff-election
    And the play's nominated players from votes of the previous history record should be the following players
      | name |
      | Juju |
    And the play's targets from the previous history record should be undefined
    And the game's current play should be stuttering-judge to choose-sign

    When the stuttering judge chooses his sign
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be undefined
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be undefined
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes and the stuttering judge does his sign
      | name   | vote   |
      | JB     | Juju   |
      | Juju   | Doudou |
      | Doudou | Juju   |
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be the following votes
      | name   | vote   |
      | JB     | Juju   |
      | Juju   | Doudou |
      | Doudou | Juju   |
    And the play's voting result from the previous history record should be tie
    And the play's nominated players from votes of the previous history record should be the following players
      | name   |
      | Juju   |
      | Doudou |
    And the game's current play should be sheriff to settle-votes

    When the sheriff breaks the tie in votes by choosing the player named Doudou
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be undefined
    And the game's current play should be survivors to vote because stuttering-judge-request

    When the survivors vote with the following votes
      | name | vote |
      | JB   | Juju |
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be the following votes
      | name | vote |
      | JB   | Juju |
    And the play's voting result from the previous history record should be inconsequential
    And the play's nominated players from votes of the previous history record should be the following players
      | name |
      | Juju |
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | name    | vote    |
      | JB      | Antoine |
      | Antoine | JB      |
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be the following votes
      | name    | vote    |
      | JB      | Antoine |
      | Antoine | JB      |
    And the play's voting result from the previous history record should be tie
    And the play's nominated players from votes of the previous history record should be the following players
      | name    |
      | Antoine |
      | JB      |
    And the game's current play should be survivors to vote because previous-votes-were-in-ties

    When the survivors vote with the following votes
      | name    | vote    |
      | JB      | Antoine |
      | Antoine | JB      |
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be the following votes
      | name    | vote    |
      | JB      | Antoine |
      | Antoine | JB      |
    And the play's voting result from the previous history record should be inconsequential
    And the play's nominated players from votes of the previous history record should be the following players
      | name    |
      | Antoine |
      | JB      |
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Morgan
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | name | vote    |
      | JB   | Antoine |
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be the following votes
      | name | vote    |
      | JB   | Antoine |
    And the play's voting result from the previous history record should be death
    And the play's nominated players from votes of the previous history record should be the following players
      | name    |
      | Antoine |