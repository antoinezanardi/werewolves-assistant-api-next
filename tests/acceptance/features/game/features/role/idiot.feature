@idiot-role

Feature: 🤪 Idiot role

  Scenario: 🤪 Idiot doesn't die if his death is from votes but his role is revealed
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | idiot    |
      | Olivia  | villager |
      | JB      | villager |
      | Thomas  | werewolf |

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target  |
      | Olivia | Antoine |
      | Thomas | Antoine |
    Then the player named Antoine should be alive
    And the player named Antoine should have his role revealed

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
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target  |
      | Olivia  | Antoine |
      | Antoine | Olivia  |
    Then the game's current play should be sheriff to settle-votes

    When the sheriff breaks the tie in votes by choosing the player named Antoine
    Then the player named Antoine should be alive
    And the player named Antoine should have his role revealed

  Scenario: 🤪 Idiot doesn't die if his role is not revealed and ancient dies
    Given a created game with options described in file no-sheriff-option.json, ancient-one-life-against-werewolves-option.json and with the following players
      | name    | role     |
      | Antoine | idiot    |
      | Olivia  | villager |
      | JB      | ancient  |
      | Thomas  | werewolf |

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target  |
      | Olivia | Antoine |
      | Thomas | Antoine |
    Then the player named Antoine should be alive
    And the player named Antoine should have his role revealed

  Scenario: 🤪 Idiot dies if his role is revealed and ancient dies
    Given a created game with options described in file no-sheriff-option.json, ancient-one-life-against-werewolves-option.json and with the following players
      | name    | role     |
      | Antoine | idiot    |
      | Olivia  | villager |
      | JB      | ancient  |
      | Thomas  | werewolf |

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target  |
      | JB     | Antoine |
      | Thomas | Antoine |
    Then the player named Antoine should be alive
    And the player named Antoine should have his role revealed
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the player named Antoine should be murdered by survivors from reconsider-pardon

  Scenario: 🤪 Idiot doesn't die if his role is revealed and ancient dies with the right option
    Given a created game with options described in file no-sheriff-option.json, ancient-one-life-against-werewolves-option.json, idiot-doesnt-die-on-ancient-death-option.json and with the following players
      | name    | role     |
      | Antoine | idiot    |
      | Olivia  | villager |
      | JB      | ancient  |
      | Thomas  | werewolf |

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

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