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
    Then the request should have succeeded with status code 201
    And the game's current play should be survivors to elect-sheriff

    When the survivors elect sheriff with the following votes
      | voter  | target |
      | JB     | Olivia |
      | Thomas | Olivia |
    Then the player named Olivia should have the active sheriff from survivors attribute
    And the game's current play should be stuttering-judge to choose-sign

    When the stuttering judge chooses his sign
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten

    When the survivors vote with the following votes and the stuttering judge does his sign
      | voter   | target |
      | Antoine | Olivia |
      | Olivia  | Thomas |
      | Thomas  | Olivia |
    Then the player named Antoine should be murdered by survivors from vote-scapegoated
    And the game's current play should be scapegoat to ban-voting
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be consequential
    And the game's current play can be skipped
    And the game's current play should have eligible targets boundaries from 0 to 4

    When the scapegoat bans from vote the following players
      | name   |
      | Olivia |
    Then the request should have succeeded with status code 200
    And 1 of the following players should have the inactive cant-vote from scapegoat attribute
      | name   |
      | Olivia |
    And the game's current play should be survivors to vote because stuttering-judge-request

    When the survivors vote with the following votes
      | voter  | target |
      | Thomas | Dad    |
      | Olivia | Dad    |
    Then the player named Dad should be murdered by survivors from vote

    When the werewolves eat the player named Mom
    Then the player named Mom should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote
    And the following players should have the active cant-vote from scapegoat attribute
      | name   |
      | Olivia |

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

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Olivia |
      | Olivia  | Thomas |
      | Thomas  | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And 3 of the following players should have the active powerless from ancient attribute
      | name    |
      | Antoine |
      | JB      |
      | Mom     |
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten

    When the survivors vote with the following votes
      | voter   | target  |
      | Antoine | Thomas  |
      | Thomas  | Antoine |
    Then the game's current play should be survivors to vote because previous-votes-were-in-ties
    And the player named Antoine should be alive

  Scenario: 🐐 Scapegoat ban occurs only on next day even if he bans during the night

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role      |
      | Antoine | scapegoat |
      | Olivia  | ancient   |
      | JB      | angel     |
      | Thomas  | werewolf  |
      | Mom     | villager  |

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Olivia |
      | Olivia  | Thomas |
    Then the player named Antoine should be murdered by survivors from vote-scapegoated
    And the game's current play should be scapegoat to ban-voting
    And the game's current play should have eligible targets boundaries from 0 to 4

    When the scapegoat bans from vote the following players
      | name   |
      | Olivia |
    Then the following players should have the inactive cant-vote from scapegoat attribute
      | name   |
      | Olivia |

    When the werewolves eat the player named Mom
    Then the player named Mom should be murdered by werewolves from eaten
    And the game's phase should be day
    And the game's current play should be survivors to vote
    And the following players should have the active cant-vote from scapegoat attribute
      | name   |
      | Olivia |

    When the player or group skips his turn
    Then the game's phase should be night
    And nobody should have the active cant-vote from scapegoat attribute

  Scenario: 🐐 Scapegoat can't ban from votes an unknown player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role      |
      | Antoine | scapegoat |
      | Olivia  | ancient   |
      | JB      | angel     |
      | Thomas  | werewolf  |

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Olivia |
      | Olivia  | Thomas |
    Then the player named Antoine should be murdered by survivors from vote-scapegoated
    And the game's current play should be scapegoat to ban-voting

    When the player or group targets an unknown player
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🐐 Scapegoat can't ban from votes a dead player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role      |
      | Antoine | scapegoat |
      | Olivia  | villager  |
      | JB      | angel     |
      | Thomas  | werewolf  |
      | Juju    | villager  |

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Juju   |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target  |
      | Antoine | Thomas  |
      | Thomas  | Antoine |
    Then the player named Antoine should be murdered by survivors from vote-scapegoated
    And the game's current play should be scapegoat to ban-voting

    When the scapegoat bans from vote the following players
      | name   |
      | Olivia |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "At least one of the scapegoat targets can't be banned from voting"