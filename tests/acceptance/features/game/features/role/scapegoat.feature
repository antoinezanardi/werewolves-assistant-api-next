@scapegoat-role
Feature: 🐐 Scapegoat role

  Scenario: 🐐 Scapegoat bans from votes after a tie in votes, even if the active sheriff is here
    Given a created game with the following players
      | name    | role             |
      | Antoine | scapegoat        |
      | Olivia  | villager         |
      | JB      | villager         |
      | Thomas  | werewolf         |
      | Mom     | villager         |
      | Dad     | stuttering-judge |
    Then the game's current play should be all to elect-sheriff

    When all elect sheriff with the following votes
      | voter  | target |
      | JB     | Olivia |
      | Thomas | Olivia |
    Then the player named Olivia should have the active sheriff from all attribute
    And the game's current play should be stuttering-judge to choose-sign

    When the stuttering judge chooses his sign
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten

    When all vote with the following votes and the stuttering judge does his sign
      | voter   | target |
      | Antoine | Olivia |
      | Olivia  | Thomas |
      | Thomas  | Olivia |
    Then the player named Antoine should be murdered by all from vote-scapegoated
    And the game's current play should be scapegoat to ban-voting

    When the scapegoat bans from vote the following players
      | name   |
      | Olivia |
      | Thomas |
    Then 2 of the following players should have the inactive cant-vote from scapegoat attribute
      | name   |
      | Olivia |
      | Thomas |
    And the game's current play should be all to vote because stuttering-judge-request

    When all vote with the following votes
      | voter  | target |
      | Thomas | Dad    |
      | Olivia | Dad    |
    Then the player named Dad should be murdered by all from vote

    When the werewolves eat the player named Mom
    Then the player named Mom should be murdered by werewolves from eaten
    And the game's current play should be all to vote
    And 2 of the following players should have the active cant-vote from scapegoat attribute
      | name   |
      | Olivia |
      | Thomas |

    When the player or group skips his turn
    Then the game's phase should be night
    And nobody should have the active cant-vote from scapegoat attribute

  Scenario: 🐐 Scapegoat doesn't ban if he's powerless

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role      |
      | Antoine | scapegoat |
      | Olivia  | ancient   |
      | JB      | angel     |
      | Thomas  | werewolf  |
      | Mom     | villager  |

    When all vote with the following votes
      | voter   | target |
      | Antoine | Olivia |
      | Olivia  | Thomas |
      | Thomas  | Olivia |
    Then the player named Olivia should be murdered by all from vote
    And 3 of the following players should have the active powerless from ancient attribute
      | name    |
      | Antoine |
      | JB      |
      | Mom     |
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten

    When all vote with the following votes
      | voter   | target  |
      | Antoine | Thomas  |
      | Thomas  | Antoine |
    Then the game's current play should be all to vote because previous-votes-were-in-ties
    And the player named Antoine should be alive

  Scenario: 🐐 Scapegoat ban should occur only on next day even if he bans during the night

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role      |
      | Antoine | scapegoat |
      | Olivia  | ancient   |
      | JB      | angel     |
      | Thomas  | werewolf  |
      | Mom     | villager  |

    When all vote with the following votes
      | voter   | target |
      | Antoine | Olivia |
      | Olivia  | Thomas |
    Then the player named Antoine should be murdered by all from vote-scapegoated
    And the game's current play should be scapegoat to ban-voting

    When the scapegoat bans from vote the following players
      | name   |
      | Olivia |
      | Thomas |
    Then 2 of the following players should have the inactive cant-vote from scapegoat attribute
      | name   |
      | Olivia |
      | Thomas |

    When the werewolves eat the player named Mom
    Then the player named Mom should be murdered by werewolves from eaten
    And the game's phase should be day
    And the game's current play should be all to vote
    And 2 of the following players should have the active cant-vote from scapegoat attribute
      | name   |
      | Olivia |
      | Thomas |

    When the player or group skips his turn
    Then the game's phase should be night
    And nobody should have the active cant-vote from scapegoat attribute