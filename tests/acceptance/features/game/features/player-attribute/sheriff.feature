@sheriff-player-attribute

Feature: 🎖️ Sheriff player attribute

  Scenario: 🎖️ Sheriff must break ties between votes
    Given a created game with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | Thomas  | villager |
      | JB      | villager |
      | Babou   | villager |
    Then the game's current play should be all to elect-sheriff

    When all elect sheriff with the following votes
      | voter   | target |
      | Antoine | Olivia |
      | JB      | Olivia |
      | Thomas  | Olivia |
    Then the player named Olivia should have the active sheriff from all attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Babou
    Then the player named Babou should be murdered by werewolves from eaten
    And the game's current play should be all to vote

    When all vote with the following votes
      | voter  | target |
      | JB     | Thomas |
      | Thomas | JB     |
    Then the player named JB should be alive
    And the player named Thomas should be alive
    And the game's current play should be sheriff to settle-votes

    When the sheriff breaks the tie in votes by choosing the player named Thomas
    Then the player named JB should be alive
    And the player named Thomas should be murdered by sheriff from vote
