@werewolf-role

Feature: 🐺 Werewolf role

  Scenario: 🐺 Werewolves eat a player

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | villager              |
      | Juju    | witch                 |
      | Doudou  | vile-father-of-wolves |
      | Thom    | werewolf              |
    Then the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name   |
      | Doudou |
      | Thom   |
    And the game's current play occurrence should be on-nights
    And the game's current play can not be skipped

    When the werewolves eat the player named Juju
    Then the player named Juju should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the player named Juju should be murdered by werewolves from eaten