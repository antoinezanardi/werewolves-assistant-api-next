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
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

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
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be seer to look
    And the game's current play should be played by the following players
      | name |
      | JB   |

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
      | name    | role            |
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

  Scenario: 🎀 Devoted servant must delegate if she was sheriff before stealing a role

    Given a created game with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | villager        |
      | JB      | devoted-servant |
      | Thomas  | villager        |
    Then the game's current play should be survivors to elect-sheriff

    When the survivors elect sheriff with the following votes
      | voter  | target |
      | Olivia | JB     |
    Then the player named JB should have the active sheriff from survivors attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Thomas
    Then the player named Thomas should be currently a devoted-servant and originally a villager
    And the player named JB should be currently a villager and originally a devoted-servant
    And the player named Thomas should have his role revealed
    And the player named JB should not have his role revealed
    And the game's current play should be sheriff to delegate
    And the game's current play should be played by the following players
      | name |
      | JB   |
    And the game's current play should have the following eligible targets interactable players
      | name    |
      | Antoine |
      | Olivia  |
    And the game's current play eligible targets interactable player named Antoine should have the following interactions
      | source  | interaction           |
      | sheriff | transfer-sheriff-role |
    And the game's current play eligible targets interactable player named Olivia should have the following interactions
      | source  | interaction           |
      | sheriff | transfer-sheriff-role |

  Scenario: 🎀 Devoted servant doesn't delegate if she was sheriff and steals the role of idiot

    Given a created game with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | villager        |
      | JB      | devoted-servant |
      | Thomas  | idiot           |
    Then the game's current play should be survivors to elect-sheriff

    When the survivors elect sheriff with the following votes
      | voter  | target |
      | Olivia | JB     |
    Then the player named JB should have the active sheriff from survivors attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Thomas
    Then the player named Thomas should be currently a devoted-servant and originally a idiot
    And the player named JB should be currently a idiot and originally a devoted-servant
    And the player named Thomas should have his role revealed
    And the player named JB should not have his role revealed
    And the player named JB should have the active sheriff from survivors attribute
    And the game's current play should be survivors to vote

  Scenario: 🎀 Devoted servant steals the role of the hunter before he dies so he doesn't shoot anybody

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | villager        |
      | JB      | devoted-servant |
      | Thomas  | hunter          |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Thomas
    Then the player named Thomas should be currently a devoted-servant and originally a hunter
    And the player named Thomas should have his role revealed
    And the player named JB should be currently a hunter and originally a devoted-servant
    And the player named JB should not have his role revealed
    And the game's current play should be survivors to vote

  Scenario: 🎀 Devoted servant is not charmed by pied piper anymore if she steals a role

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | villager        |
      | JB      | devoted-servant |
      | Thomas  | pied-piper      |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the game's current play should be pied-piper to charm

    When the pied piper charms the following players
      | name   |
      | JB     |
      | Olivia |
    Then the player named JB should have the active charmed from pied-piper attribute
    And the player named Olivia should have the active charmed from pied-piper attribute
    And the game's current play should be charmed to meet-each-other

    When the charmed people meet each other
    Then the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a villager
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a villager and originally a devoted-servant
    And the player named JB should not have his role revealed
    And the player named JB should not have the active charmed from pied-piper attribute

  Scenario: 🎀 Devoted servant remains infected if she steals a role and so, as bear tamer, growls everyday

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name     | role                 |
      | Antoine  | accursed-wolf-father |
      | Olivia   | villager             |
      | JB       | devoted-servant      |
      | Thomas   | bear-tamer           |
      | Juju     | villager             |
      | Mathilde | villager             |
    Then the game's current play should be werewolves to eat

    When the accursed wolf-father infects the player named JB
    Then the player named JB should be on werewolves current side and originally be on villagers side
    And the player named Thomas should have the active growled from bear-tamer attribute
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter    | target |
      | Mathilde | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Thomas
    Then the player named Thomas should be currently a devoted-servant and originally a bear-tamer
    And the player named Thomas should be on villagers current side and originally be on villagers side
    And the player named Thomas should have his role revealed
    And the player named JB should be currently a bear-tamer and originally a devoted-servant
    And the player named JB should not have his role revealed
    And the player named JB should be on werewolves current side and originally be on villagers side
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | JB      |

    When the werewolves eat the player named Juju
    Then the player named Juju should be murdered by werewolves from eaten
    And the player named JB should have the active growled from bear-tamer attribute
    And the game's current play should be survivors to bury-dead-bodies

  Scenario: 🎀 Devoted Servant can protect whoever she wants as a defender, even the last target of the previous one

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | villager        |
      | JB      | devoted-servant |
      | Thomas  | defender        |
    And the game's current play should be defender to protect

    When the defender protects the player named JB
    Then the player named JB should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the player named JB should not have the active protected from defender attribute
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Thomas
    Then the player named Thomas should be currently a devoted-servant and originally a defender
    And the player named Thomas should have his role revealed
    And the player named JB should be currently a defender and originally a devoted-servant
    And the player named JB should not have his role revealed
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be defender to protect

    When the defender protects the player named JB
    Then the player named JB should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be alive
    And the player named JB should not have the active protected from defender attribute
    And the game's current play should be survivors to vote

  Scenario: 🎀 Devoted Servant can infect again as the accursed wolf-father even if he already infected

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name     | role                 |
      | Antoine  | accursed-wolf-father |
      | Olivia   | villager             |
      | JB       | devoted-servant      |
      | Juju     | villager             |
      | Mathilde | villager             |
    Then the game's current play should be werewolves to eat

    When the accursed wolf-father infects the player named Mathilde
    Then the player named Mathilde should be on werewolves current side and originally be on villagers side
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter    | target  |
      | Olivia   | Antoine |
      | Mathilde | Antoine |
    Then the player named Antoine should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Antoine
    Then the player named Antoine should be currently a devoted-servant and originally a accursed-wolf-father
    And the player named Antoine should be on villagers current side and originally be on werewolves side
    And the player named Antoine should have his role revealed
    And the player named JB should be currently a accursed-wolf-father and originally a devoted-servant
    And the player named JB should not have his role revealed
    And the player named JB should be on werewolves current side and originally be on villagers side
    And the game's current play should be werewolves to eat

    When the accursed wolf-father infects the player named Juju
    Then the player named Juju should be on werewolves current side and originally be on villagers side
    And the game's current play should be survivors to vote

  Scenario: 🎀 Devoted Servant can use potions again as the witch even if she already used them

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name     | role            |
      | Antoine  | werewolf        |
      | Olivia   | witch           |
      | JB       | devoted-servant |
      | Juju     | villager        |
      | Mathilde | villager        |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the game's current play should be witch to use-potions

    When the witch uses life potion on the player named JB and death potion on the player named Olivia
    Then the player named Olivia should be murdered by witch from death-potion
    And the player named JB should be alive
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a witch
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a witch and originally a devoted-servant
    And the player named JB should not have his role revealed
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the game's current play should be witch to use-potions

    When the witch uses life potion on the player named JB and death potion on the player named Juju
    Then the player named Juju should be murdered by witch from death-potion
    And the player named JB should be alive
    And the game's current play should be survivors to bury-dead-bodies