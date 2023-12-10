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
    And the game's additional card with role seer for actor should not be used
    And the game's additional card with role witch for actor should not be used
    And the game's additional card with role little-girl for actor should not be used
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
    And the game's current play occurrence should be on-nights
    And the game's current play can be skipped
    And the game's current play should not have eligible targets

    When the actor chooses card with role seer
    Then the request should have succeeded with status code 200
    And the player named Antoine should be currently a seer and originally a actor
    And the game's additional card with role seer for actor should be used
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
    And the game's additional card with role witch for actor should be used
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
    And the game's additional card with role little-girl for actor should not be used
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
    And the game's additional card with role little-girl for actor should be used
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Louise
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the player named Antoine should be currently a actor and originally a actor
    And the game's current play should be werewolves to eat

  Scenario: 🎭 Actor can't choose an unknown card

    Given a created game with additional cards described in file seer-witch-little-girl-additional-cards-for-actor.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | actor    |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | villager |
      | Louise  | villager |
    Then the game's current play should be actor to choose-card

    When the actor chooses an unknown card
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Additional card with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Chosen card is not in the game additional cards"

  Scenario: 🎭 Actor can't choose an already used card

    Given a created game with additional cards described in file seer-witch-little-girl-additional-cards-for-actor.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | actor    |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | villager |
      | Louise  | villager |
    Then the game's current play should be actor to choose-card

    When the actor chooses card with role seer
    Then the game's current play should be seer to look

    When the seer looks at the player named Olivia
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the player named Antoine should be currently a actor and originally a actor
    And the game's current play should be actor to choose-card

    When the actor chooses card with role seer
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Chosen card is already used"

  Scenario: 🎭 Actor can't choose a card for thief

    Given a created game with additional cards described in file valid-additional-cards-for-thief-and-actor.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | actor    |
      | Olivia  | thief    |
      | JB      | werewolf |
      | Thomas  | villager |
      | Louise  | villager |
    Then the game's current play should be thief to choose-card

    When the player or group skips his turn
    Then the game's current play should be actor to choose-card

    When the actor chooses card with role seer
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Chosen card is not for actor"

  Scenario: 🎭 Actor acts as cupid, defender and hunter

    Given a created game with additional cards described in file cupid-defender-hunter-additional-cards-for-actor.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | actor    |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | villager |
      | Louise  | villager |
    Then the game's current play should be actor to choose-card

    When the actor chooses card with role defender
    Then the player named Antoine should be currently a defender and originally a actor
    And the game's additional card with role defender for actor should be used
    And the game's current play should be defender to protect
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the defender protects the player named Antoine
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be actor to choose-card

    When the actor chooses card with role cupid
    Then the player named Antoine should be currently a cupid and originally a actor
    And the game's additional card with role cupid for actor should be used
    And the game's current play should be cupid to charm
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the cupid shoots an arrow at the player named Thomas and the player named Louise
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Louise
    Then the game's current play should be survivors to bury-dead-bodies
    And the player named Louise should be murdered by eaten from werewolves
    And the player named Thomas should be murdered by in-love from cupid

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be actor to choose-card

    When the actor chooses card with role hunter
    Then the player named Antoine should be currently a hunter and originally a actor
    And the game's additional card with role hunter for actor should be used
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be hunter to shoot
    And the game's current play should be played by the following players
      | name    |
      | Antoine |

    When the hunter shoots at the player named Olivia
    Then the player named Olivia should be murdered by shot from hunter

#  Scenario: 🎭 Actor acts as elder, idiot and scapegoat

#  Scenario: 🎭 Actor acts as fox, stuttering judge and rusty-sword-knight

#  Scenario: 🎭 Actor acts as angel and wins

#  Scenario: 🎭 Actor acts as wild child and becomes a werewolf because the model died and thus becomes powerless

#  Scenario: 🎭 Actor acts as wild child but doesn't becomes a werewolf because he became back an actor before the model died

#  Scenario: 🎭 Actor acts as wolf-hound and becomes a werewolf and thus becomes powerless

#  Scenario: 🎭 Actor acts as pied piper and wins

#  Scenario: 🎭 Actor acts as scandalmonger

#  Scenario: 🎭 Actor becomes powerless when he is infected by the accursed wolf-father