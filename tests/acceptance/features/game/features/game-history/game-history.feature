@game-history

Feature: 📜 Game History

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