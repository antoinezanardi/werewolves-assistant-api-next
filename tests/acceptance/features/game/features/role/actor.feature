@actor-role

Feature: 🎭 Actor role

  Scenario: 🎭 Actor can become the role of the card he choses or can skip

    Given a created game with additional cards described in file seer-witch-little-girl-additional-cards-for-actor.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | actor    |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | villager |
      | Louise  | villager |
    Then the request should have succeeded with status code 201
    And the game's current play should be actor to choose-card
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be on-nights
    And the game's current play can be skipped
    And the game's current play should not have eligible targets

    When the actor chooses card with role seer
    Then the request should have succeeded with status code 200
    And the player named Antoine should be currently a seer and originally a actor
    And the game's current play should be seer to look
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the seer looks at the player named Olivia
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the player named Antoine should be currently a actor and originally a actor
    And the game's current play should be actor to choose-card

    When the actor chooses card with role witch
    Then the player named Antoine should be currently a witch and originally a actor
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be witch to use-potions
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the witch uses life potion on the player named Antoine
    Then the player named Antoine should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the player named Antoine should be currently a actor and originally a actor
    And the game's current play should be actor to choose-card

    When the player or group skips his turn
    Then the request should have succeeded with status code 200
    And the player named Antoine should be currently a actor and originally a actor
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the player named Antoine should be currently a actor and originally a actor
    And the game's current play should be actor to choose-card

    When the actor chooses card with role little-girl
    Then the player named Antoine should be currently a little-girl and originally a actor
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Louise
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the player named Antoine should be currently a actor and originally a actor
    And the game's current play should be werewolves to eat
#    Check the additional cards for actor is used or not