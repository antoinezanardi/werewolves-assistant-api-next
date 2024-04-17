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
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Olivia |
      | Olivia  | Thomas |
      | Thomas  | Olivia |
    Then the player named Antoine should be murdered by survivors from vote-scapegoated
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be scapegoat to ban-voting
    And the game's current play should not have causes
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play type should be target
    And the game's current play occurrence should be consequential
    And the game's current play can be skipped
    And the game's current play source should have the following interactions
      | type       | source    | minBoundary | maxBoundary |
      | ban-voting | scapegoat | 0           | 4           |
    And the game's current play source interaction with type ban-voting should have the following eligible targets
      | name   |
      | Olivia |
      | Thomas |
      | Mom    |
      | Dad    |
    And the game's current play source interaction with type ban-voting should have consequences

    When the scapegoat bans from vote the following players
      | name   |
      | Olivia |
    Then the request should have succeeded with status code 200
    And 1 of the following players should have the inactive cant-vote from scapegoat attribute
      | name   |
      | Olivia |

    When the stuttering judge requests another vote
    And the game's current play should be survivors to vote
    And the game's current play should have the following causes
      | cause                    |
      | stuttering-judge-request |
    And the game's current play source should have the following interactions
      | type | source    | minBoundary | maxBoundary |
      | vote | survivors | 0           | 4           |
    And the game's current play should be survivors to vote
    And the game's current play should have the following causes
      | cause                    |
      | stuttering-judge-request |

    When the survivors vote with the following votes
      | voter  | target |
      | Thomas | Dad    |
      | Olivia | Dad    |
    Then the player named Dad should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Mom
    Then the player named Mom should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote
    And the following players should have the active cant-vote from scapegoat attribute
      | name   |
      | Olivia |

    When the player or group skips his turn
    Then the game's phase name should be night
    And nobody should have the active cant-vote from scapegoat attribute

  Scenario: 🐐 Scapegoat doesn't ban if he's powerless

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role      |
      | Antoine | scapegoat |
      | Olivia  | elder     |
      | JB      | angel     |
      | Thomas  | werewolf  |
      | Mom     | villager  |

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Olivia |
      | Olivia  | Thomas |
      | Thomas  | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then 3 of the following players should have the active powerless from elder attribute
      | name    |
      | Antoine |
      | JB      |
      | Mom     |
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target  |
      | Antoine | Thomas  |
      | Thomas  | Antoine |
    And the game's current play should be survivors to vote
    And the game's current play should have the following causes
      | cause                       |
      | previous-votes-were-in-ties |
    And the player named Antoine should be alive

  Scenario: 🐐 Scapegoat ban occurs only on next day even if he bans during the night

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role      |
      | Antoine | scapegoat |
      | Olivia  | elder     |
      | JB      | angel     |
      | Thomas  | werewolf  |
      | Mom     | villager  |

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Olivia |
      | Olivia  | Thomas |
    Then the player named Antoine should be murdered by survivors from vote-scapegoated
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be scapegoat to ban-voting
    And the game's current play source should have the following interactions
      | type       | source    | minBoundary | maxBoundary |
      | ban-voting | scapegoat | 0           | 4           |

    When the scapegoat bans from vote the following players
      | name   |
      | Olivia |
    Then the following players should have the inactive cant-vote from scapegoat attribute
      | name   |
      | Olivia |

    When the werewolves eat the player named Mom
    Then the player named Mom should be murdered by werewolves from eaten
    And the game's phase name should be day
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote
    And the following players should have the active cant-vote from scapegoat attribute
      | name   |
      | Olivia |

    When the player or group skips his turn
    Then the game's phase name should be night
    And nobody should have the active cant-vote from scapegoat attribute

  Scenario: 🐐 Scapegoat can't ban from votes an unknown player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role      |
      | Antoine | scapegoat |
      | Olivia  | elder     |
      | JB      | angel     |
      | Thomas  | werewolf  |

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Olivia |
      | Olivia  | Thomas |
    Then the player named Antoine should be murdered by survivors from vote-scapegoated
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be scapegoat to ban-voting

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
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies
    And the game's current play source should have the following interactions
      | type | source    | minBoundary | maxBoundary |
      | bury | survivors | 0           | 1           |
    And the game's current play source interaction with type bury should have the following eligible targets
      | name   |
      | Olivia |
    And the game's current play source interaction with type bury should be inconsequential
    And the game's current play can be skipped

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target  |
      | Antoine | Thomas  |
      | Thomas  | Antoine |
    Then the player named Antoine should be murdered by survivors from vote-scapegoated
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be scapegoat to ban-voting

    When the scapegoat bans from vote the following players
      | name   |
      | Olivia |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "At least one of the scapegoat targets can't be banned from voting"