Feature: Small basic game with 4 players

  Background:
    Given a created game described in file small-game.json

  Scenario: Villagers win the game
    When all elect sheriff with the following votes
      | source  | target  |
      | Antoine | Olivia  |
      | Thomas  | Olivia  |
      | JB      | Antoine |
      | Olivia  | JB      |
    Then the player named Olivia should have the sheriff from all attribute
    And the game's tick should be 2
    And the game's turn should be 1
    And the game's phase should be night
    And the game's current play should be seer to look

    When the seer looks at the player named Antoine
    Then the player named Antoine should have the seen from seer attribute
    And the game's tick should be 3
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should have the eaten from werewolves attribute
    And the game's tick should be 4
    And the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Thomas
    Then the game's turn should be 1
    And the game's phase should be day