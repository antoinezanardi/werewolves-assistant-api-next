@dog-wolf-role
Feature: 🐶 Dog Wolf role

  Scenario: 🐶 Dog Wolf chooses the villagers side

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | dog-wolf |
      | Benoit  | villager |
      | Cecile  | villager |
      | David   | werewolf |
    Then the game's current play should be dog-wolf to choose-side
    And the player named Antoine should be on villagers current side and originally be on villagers side

    When the dog wolf chooses the villagers side
    Then the player named Antoine should be on villagers current side and originally be on villagers side

  Scenario: 🐶 Dog Wolf chooses the werewolves side

    When a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | dog-wolf |
      | Benoit  | villager |
      | Cecile  | villager |
      | David   | werewolf |
    Then the game's current play should be dog-wolf to choose-side
    And the player named Antoine should be on villagers current side and originally be on villagers side

    When the dog wolf chooses the werewolves side
    Then the player named Antoine should be on werewolves current side and originally be on villagers side