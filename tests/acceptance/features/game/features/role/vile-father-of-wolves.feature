@vile-father-of-wolves-role

Feature: 🐺 Vile Father of Wolves role

  Scenario: 🐺 Vile Father of Wolves infects a player instead of eating it
    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | vile-father-of-wolves |
      | Olivia  | seer                  |
      | JB      | villager              |
      | Thomas  | villager              |
    Then the game's current play should be seer to look

    When the seer looks at the player named Antoine
    Then the game's current play should be werewolves to eat

    When the vile father of wolves infects the player named Olivia
    Then the player named Olivia should be on werewolves current side and originally be on villagers side
    And the player named Olivia should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be seer to look

  Scenario: 🐺 Vile Father of Wolves doesn't infect the ancient if he still have lives
    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | vile-father-of-wolves |
      | Olivia  | ancient               |
      | JB      | villager              |
      | Thomas  | villager              |
    Then the game's current play should be werewolves to eat

    When the vile father of wolves infects the player named Olivia
    Then the player named Olivia should be on villagers current side and originally be on villagers side
    And the player named Olivia should be alive

  Scenario: 🐺 Vile Father of Wolves infects the ancient if he only has one life left
    Given a created game with options described in files no-sheriff-option.json, ancient-one-life-against-werewolves-option.json and with the following players
      | name    | role                  |
      | Antoine | vile-father-of-wolves |
      | Olivia  | ancient               |
      | JB      | villager              |
      | Thomas  | villager              |
    Then the game's current play should be werewolves to eat

    When the vile father of wolves infects the player named Olivia
    Then the player named Olivia should be on werewolves current side and originally be on villagers side
    And the player named Olivia should be alive