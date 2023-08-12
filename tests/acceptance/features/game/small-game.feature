Feature: Small basic game with 4 players

  Background:
    Given a created game described in file small-game.json

  Scenario: 🧑🏻‍🌾 Villagers win the game
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
    And the player named Thomas should be alive
    And the game's current play should be all to vote

    When all vote with the following votes
      | source  | target  |
      | Antoine | Olivia  |
      | Thomas  | Olivia  |
      | JB      | Antoine |
    Then the player named Olivia should be murdered by all from vote
    And the game's phase should be day
    And the game's current play should be sheriff to delegate

    When the sheriff delegates his role to the player named JB
    Then the player named JB should have the sheriff from sheriff attribute
    And the game's current play should be hunter to shoot
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the hunter shoots at the player named JB
    Then the player named JB should be murdered by hunter from shot
    And the game's status should be over
    And the game's winners should be villagers with the following players
      | name    |
      | Antoine |
      | Olivia  |
      | Thomas  |

  Scenario: 🐺 Werewolves win the game
    When all elect sheriff with the following votes
      | source  | target  |
      | Antoine | Olivia  |
      | Thomas  | Olivia  |
      | JB      | Antoine |
      | Olivia  | Antoine |
    Then the game's current play should be all to elect-sheriff because previous-votes-were-in-ties
    But nobody should have the sheriff attribute

    When all elect sheriff with the following votes
      | source  | target |
      | Antoine | Olivia |
      | Thomas  | Olivia |
    Then the player named Olivia should have the sheriff from all attribute
    And the game's current play should be seer to look

    When the seer looks at the player named JB
    Then the player named JB should have the seen from seer attribute
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name |
      | JB   |

    When the werewolves eat the player named Thomas
    Then the player named Thomas should have the eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the witch uses death potion on the player named Olivia
    Then the game's phase should be day
    And the player named Olivia should be murdered by witch from death-potion
    And the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be sheriff to delegate

    When the sheriff delegates his role to the player named Antoine
    Then the player named Antoine should have the sheriff from sheriff attribute
    And the game's current play should be hunter to shoot
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the hunter shoots at the player named Antoine
    Then the player named Antoine should be murdered by hunter from shot
    And the game's status should be over
    And the game's winners should be werewolves with the following players
      | name |
      | JB   |

  Scenario: ☠️ Nobody wins the game
    When all elect sheriff with the following votes
      | source  | target  |
      | Antoine | JB      |
      | Thomas  | JB      |
      | JB      | Antoine |
      | Olivia  | Antoine |
    Then the game's current play should be all to elect-sheriff because previous-votes-were-in-ties
    But nobody should have the sheriff attribute

    When all elect sheriff with the following votes
      | source  | target  |
      | Antoine | JB      |
      | Thomas  | Antoine |
    Then 1 of the following players should have the sheriff from all attribute
      | name    |
      | Antoine |
      | JB      |
    And the game's current play should be seer to look
    And the game's current play should be played by the following players
      | name   |
      | Thomas |

    When the seer looks at the player named JB
    Then the player named JB should have the seen from seer attribute
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name |
      | JB   |

    When the werewolves eat the player named Olivia
    Then the player named Olivia should have the eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Olivia
    Then the player named Olivia should be alive
    And nobody should have the eaten from werewolves attribute
    And nobody should have the drank-life-potion from witch attribute
    And the game's phase should be day
    And the game's current play should be all to vote
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | JB      |
      | Olivia  |
      | Thomas  |

    When all vote with the following votes
      | source  | target |
      | Antoine | Olivia |
      | Thomas  | Olivia |
      | JB      | Olivia |
    Then the player named Olivia should be murdered by all from vote
    And the game's current play should be hunter to shoot

    When the hunter shoots at the player named Thomas
    Then the player named Thomas should be murdered by hunter from shot
    And the game's phase should be night
    And the game's turn should be 2
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the eaten from werewolves attribute
    And the game's current play should be witch to use-potions
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the witch uses death potion on the player named JB
    Then the game's status should be over
    And the game's winners should be none with the following players
      | name    |