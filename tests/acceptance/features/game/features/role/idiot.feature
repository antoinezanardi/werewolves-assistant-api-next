@idiot-role

Feature: 🤪 Idiot role

  Scenario: 🤪 Idiot doesn't die if his death is from votes but his role is revealed

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | idiot    |
      | Olivia  | villager |
      | JB      | villager |
      | Thomas  | werewolf |
    Then the request should have succeeded with status code 201
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target  |
      | Olivia | Antoine |
      | Thomas | Antoine |
    Then the player named Antoine should be alive
    And the player named Antoine should have his role revealed
    And the player named Antoine should have the active cant-vote from survivors attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote
    And the game's current play source should have the following interactions
      | type | source    | minBoundary | maxBoundary |
      | vote | survivors | 0           | 1           |
    And the game's current play source interaction with type vote should have the following eligible targets
      | name    |
      | Antoine |
      | Thomas  |

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Thomas |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "One source is not able to vote because he's dead or doesn't have the ability to do so"

  Scenario: 🤪 Idiot doesn't die if his death is from settle votes but his role is revealed

    Given a created game with the following players
      | name    | role     |
      | Antoine | idiot    |
      | Olivia  | villager |
      | JB      | villager |
      | Thomas  | werewolf |

    When the survivors elect sheriff with the following votes
      | voter   | target |
      | Antoine | Thomas |
      | Olivia  | Thomas |
    Then the player named Thomas should have the active sheriff from survivors attribute

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target  |
      | Olivia  | Antoine |
      | Antoine | Olivia  |
    Then the game's current play should be sheriff to settle-votes

    When the sheriff breaks the tie in votes by choosing the player named Antoine
    Then the player named Antoine should be alive
    And the player named Antoine should have his role revealed

  Scenario: 🤪 Idiot doesn't die if his role is not revealed and elder dies

    Given a created game with options described in file no-sheriff-option.json, elder-one-life-against-werewolves-option.json and with the following players
      | name    | role     |
      | Antoine | idiot    |
      | Olivia  | villager |
      | JB      | elder    |
      | Thomas  | werewolf |

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target  |
      | Olivia | Antoine |
      | Thomas | Antoine |
    Then the player named Antoine should be alive
    And the player named Antoine should have his role revealed

  Scenario: 🤪 Idiot dies if his role is revealed and elder dies

    Given a created game with options described in file no-sheriff-option.json, elder-one-life-against-werewolves-option.json and with the following players
      | name    | role     |
      | Antoine | idiot    |
      | Olivia  | villager |
      | JB      | elder    |
      | Thomas  | werewolf |

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target  |
      | JB     | Antoine |
      | Thomas | Antoine |
    Then the player named Antoine should be alive
    And the player named Antoine should have his role revealed
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the player named Antoine should be alive
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the player named Antoine should be murdered by survivors from reconsider-pardon
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the player named Antoine should not have the active cant-vote from survivors attribute
    And the player named Antoine should have his role revealed

  Scenario: 🤪 Idiot doesn't die if his role is revealed and elder dies with the right option

    Given a created game with options described in file no-sheriff-option.json, elder-one-life-against-werewolves-option.json, idiot-doesnt-die-on-elder-death-option.json and with the following players
      | name    | role     |
      | Antoine | idiot    |
      | Olivia  | villager |
      | JB      | elder    |
      | Thomas  | werewolf |

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target  |
      | JB     | Antoine |
      | Thomas | Antoine |
    Then the player named Antoine should be alive
    And the player named Antoine should have his role revealed
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the player named Antoine should be alive