Feature: Small basic game with 4 players

  Background:
    Given a created game described in file small-game.json

  Scenario: The seer plays
    When the seer looks the player named Antoine
    Then the game's tick is 2
