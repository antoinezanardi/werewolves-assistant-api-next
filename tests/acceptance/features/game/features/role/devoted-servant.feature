@devoted-servant-role

Feature: 🎀 Devoted Servant role

  Scenario: 🎀 Devoted servant steals the role of the seer and can look each night

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | seer            |
      | JB      | devoted-servant |
      | Thomas  | villager        |
    Then the request should have succeeded with status code 201
    And the game's current play should be seer to look

    When the seer looks at the player named Antoine
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies
    And the game's current play can be skipped
    And the game's current play occurrence should be consequential
    And the game's current play should have eligible targets boundaries from 0 to 1
    And the game's current play should have the following eligible targets interactable players
      | name   |
      | Olivia |
    And the game's current play eligible targets interactable player named Olivia should have the following interactions
      | source          | interaction |
      | devoted-servant | steal-role  |

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should have the active stolen-role from devoted-servant attribute
    And the player named Olivia should be currently a devoted-servant and originally a seer
    And the player named JB should be currently a seer and originally a devoted-servant
    And the player named Olivia should have his role revealed
    And the player named JB should not have his role revealed

  Scenario: 🎀 Devoted servant can't steal the role if she is dead

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | angel           |
      | JB      | devoted-servant |
      | Thomas  | villager        |
    Then the game's current play should be survivors to vote because angel-presence

    When the survivors vote with the following votes
      | voter  | target |
      | Olivia | JB     |
    Then the player named JB should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies
    And the game's current play can be skipped
    And the game's current play should not have eligible targets

    When the devoted servant steals the role of the player named JB
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Devoted servant can't steal the role of this target because she's not in the game or dead or powerless or in love with another player"

  Scenario: 🎀 Devoted servant can't steal the role if she is powerless

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | angel           |
      | JB      | devoted-servant |
      | Thomas  | elder           |
      | Juju    | villager        |
    Then the game's current play should be survivors to vote because angel-presence

    When the survivors vote with the following votes
      | voter  | target |
      | Olivia | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the player named Juju should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies
    And the game's current play can be skipped
    And the game's current play should not have eligible targets

    When the devoted servant steals the role of the player named Juju
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Devoted servant can't steal the role of this target because she's not in the game or dead or powerless or in love with another player"

  Scenario: 🎀 Devoted servant can't steal the role if she is in love

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | villager        |
      | JB      | devoted-servant |
      | Thomas  | cupid           |
    Then the game's current play should be cupid to charm

    When the cupid shoots an arrow at the player named JB and the player named Olivia
    Then the game's current play should be lovers to meet-each-other

    When the lovers meet each other
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies
    And the game's current play can be skipped
    And the game's current play should not have eligible targets

    When the devoted servant steals the role of the player named Thomas
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Devoted servant can't steal the role of this target because she's not in the game or dead or powerless or in love with another player"

  Scenario: 🎀 Devoted servant can't steal the role of an alive player

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | villager        |
      | JB      | devoted-servant |
      | Thomas  | villager        |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Devoted servant can't steal the role of this target because he's not about to be buried"

  Scenario: 🎀 Devoted servant can't steal the role of a dead player who is not about to be buried

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | villager        |
      | JB      | devoted-servant |
      | Thomas  | villager        |
      | Juju    | villager        |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | Olivia | Juju   |
    Then the player named Juju should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Thomas
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Devoted servant can't steal the role of this target because he's not about to be buried"

  Scenario: 🎀 Devoted servant can't steal the role of an unknown player

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name   | role            |
      | Antoine | werewolf        |
      | Olivia  | villager        |
      | JB      | devoted-servant |
      | Thomas  | villager        |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the player or group targets an unknown player
    Then the request should have failed with status code 404
    And the request exception status code should be 404
    And the request exception message should be "Player with id "4c1b96d4dfe5af0ddfa19e35" not found"
    And the request exception error should be "Game Play - Player in `targets.player` is not in the game players"

  Scenario: 🎀 Devoted servant can't steal the role of multiple about to be buried players

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | villager        |
      | JB      | devoted-servant |
      | Thomas  | villager        |
      | Juju    | witch           |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the game's current play should be witch to use-potions

    When the witch uses death potion on the player named Juju
    Then the player named Thomas should be murdered by werewolves from eaten
    And the player named Juju should be murdered by witch from death-potion
    And the game's current play should be survivors to bury-dead-bodies
    And the game's current play should have eligible targets boundaries from 0 to 1
    And the game's current play should have the following eligible targets interactable players
      | name   |
      | Thomas |
      | Juju   |
    And the game's current play eligible targets interactable player named Thomas should have the following interactions
      | source          | interaction |
      | devoted-servant | steal-role  |
    And the game's current play eligible targets interactable player named Juju should have the following interactions
      | source          | interaction |
      | devoted-servant | steal-role  |

    When the player or group targets the following players
      | target |
      | Thomas |
      | Juju   |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "There are too much targets for this current game's state"