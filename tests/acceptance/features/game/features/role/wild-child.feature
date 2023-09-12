@wild-child-role
Feature: 🐒 Wild Child role

  Scenario: 🐒 Wild Child changes his side when his model dies

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role       |
      | Antoine | wild-child |
      | Olivia  | werewolf   |
      | JB      | villager   |
      | Maxime  | villager   |
    Then the game's current play should be wild-child to choose-model
    And the player named Antoine should be on villagers current side and originally be on villagers side

    When the wild child chooses the player named Olivia as a model
    Then the player named Olivia should have the active worshiped from wild-child attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When all vote with the following votes
      | voter  | target |
      | Maxime | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And the player named Antoine should be on werewolves current side and originally be on villagers side
    And the game's current play should be werewolves to eat