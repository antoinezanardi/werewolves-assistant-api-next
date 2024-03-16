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
    And the game's current play source should have the following interactions
      | type       | source          | minBoundary | maxBoundary |
      | steal-role | devoted-servant | 0           | 1           |
    And the game's current play source interaction with type steal-role should have the following eligible targets
      | name   |
      | Olivia |

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
    And the game's current play source should not have interactions

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
    And the game's current play source should not have interactions

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
    And the game's current play source should not have interactions

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
    And the game's current play source should have the following interactions
      | type       | source          | minBoundary | maxBoundary |
      | steal-role | devoted-servant | 0           | 1           |
    And the game's current play source interaction with type steal-role should have the following eligible targets
      | name   |
      | Thomas |
      | Juju   |

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
    And the game's current play source should have the following interactions
      | type                  | source  | minBoundary | maxBoundary |
      | transfer-sheriff-role | sheriff | 1           | 1           |
    And the game's current play source interaction with type transfer-sheriff-role should have the following eligible targets
      | name    |
      | Antoine |
      | Olivia  |

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

    When the werewolves eat the player named JB
    Then the game's current play should be accursed-wolf-father to infect

    When the accursed wolf-father infects the player named JB
    Then the player named JB should be on werewolves current side and originally be on villagers side
    And the game's current play should be bear-tamer to growl

    When the bear tamer calms his bear
    Then the game's current play should be survivors to vote

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
    Then the game's current play should be accursed-wolf-father to infect

    When the player or group skips his turn
    Then the game's current play should be survivors to bury-dead-bodies
    And the player named Juju should be murdered by werewolves from eaten

    When the survivors bury dead bodies
    Then the game's current play should be bear-tamer to growl

    When the bear tamer calms his bear
    Then the game's current play should be survivors to vote

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

    When the werewolves eat the player named Mathilde
    Then the game's current play should be accursed-wolf-father to infect

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

    When the werewolves eat the player named Juju
    Then the game's current play should be accursed-wolf-father to infect

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

  Scenario: 🎀 Devoted Servant can sniff as the fox even if he was powerless by himself before

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name     | role            |
      | Antoine  | werewolf        |
      | Olivia   | fox             |
      | JB       | devoted-servant |
      | Juju     | villager        |
      | Mathilde | villager        |
    Then the game's current play should be fox to sniff

    When the fox sniffs the player named Juju
    Then the player named Olivia should have the active powerless from fox attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a fox
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a fox and originally a devoted-servant
    And the player named JB should not have his role revealed
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be fox to sniff

  Scenario: 🎀 Devoted Servant can choose another side as the wolf-hound

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | wolf-hound      |
      | JB      | devoted-servant |
      | Juju    | villager        |
    Then the game's current play should be wolf-hound to choose-side

    When the wolf-hound chooses the werewolves side
    Then the player named Olivia should be on werewolves current side and originally be on villagers side
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the player named Juju should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter | target |
      | JB    | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a wolf-hound
    And the player named Olivia should be on villagers current side and originally be on villagers side
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a wolf-hound and originally a devoted-servant
    And the player named JB should not have his role revealed
    And the player named JB should be on villagers current side and originally be on villagers side
    And the game's current play should be wolf-hound to choose-side

    When the wolf-hound chooses the werewolves side
    Then the player named JB should be on werewolves current side and originally be on villagers side
    And the game's current play should be werewolves to eat

  Scenario: 🎀 Devoted Servant regains the original amount of lives against werewolves the elder had when stealing his role

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | elder           |
      | JB      | devoted-servant |
      | Juju    | defender        |
    Then the game's current play should be defender to protect

    When the defender protects the player named Olivia
    Then the player named Olivia should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be defender to protect

    When the defender protects the player named Juju
    Then the player named Juju should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be defender to protect

    When the defender protects the player named JB
    Then the player named JB should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a elder
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a elder and originally a devoted-servant
    And the player named JB should not have his role revealed
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be defender to protect

    When the defender protects the player named Juju
    Then the player named Juju should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be defender to protect

    When the defender protects the player named Antoine
    Then the player named Antoine should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the player named JB should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

  Scenario: 🎀 Devoted Servant can ask for another judgement as the judge even if he already asked for one

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name     | role             |
      | Antoine  | werewolf         |
      | Olivia   | stuttering-judge |
      | JB       | devoted-servant  |
      | Juju     | villager         |
      | Mathilde | villager         |
      | Doudou   | villager         |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the player named Juju should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target   |
      | Olivia | Mathilde |
    Then the player named Mathilde should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be stuttering-judge to request-another-vote
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the stuttering judge requests another vote
    Then the game's current play should be survivors to vote because stuttering-judge-request

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a stuttering-judge
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a stuttering-judge and originally a devoted-servant
    And the player named JB should not have his role revealed
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Doudou
    Then the player named Doudou should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be stuttering-judge to request-another-vote
    And the game's current play should be played by the following players
      | name |
      | JB   |

    When the stuttering judge requests another vote
    Then the game's current play should be survivors to vote because stuttering-judge-request

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

  Scenario: 🎀 Devoted Servant must choose another model as wild-child and the old one is then obsolete

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | wild-child      |
      | JB      | devoted-servant |
      | Juju    | villager        |
    Then the game's current play should be wild-child to choose-model

    When the wild child chooses the player named JB as a model
    Then the player named JB should have the active worshiped from wild-child attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the player named JB should have the active worshiped from wild-child attribute
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a wild-child
    And the player named Olivia should have his role revealed
    And the player named Olivia should be on villagers current side and originally be on villagers side
    And the player named JB should be currently a wild-child and originally a devoted-servant
    And the player named JB should not have his role revealed
    And the player named JB should be on villagers current side and originally be on villagers side
    And the player named JB should not have the active worshiped from wild-child attribute
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be wild-child to choose-model
    And the game's current play should be played by the following players
      | name |
      | JB   |

    When the wild child chooses the player named Juju as a model
    Then the player named Juju should have the active worshiped from wild-child attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the player named Juju should be murdered by werewolves from eaten
    And the player named Juju should have the active worshiped from wild-child attribute
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the player named JB should not have the active worshiped from wild-child attribute
    And the player named Juju should not have the active worshiped from wild-child attribute
    And the player named JB should be on werewolves current side and originally be on villagers side

  Scenario: 🎀 Devoted Servant is not powerless anymore if she steals the big bad wolf role and one wolf is dead

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | big-bad-wolf    |
      | JB      | devoted-servant |
      | Juju    | defender        |
      | Doudou  | witch           |
    Then the game's current play should be defender to protect

    When the defender protects the player named Doudou
    Then the player named Doudou should have the active protected from defender attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Doudou
    Then the player named Doudou should have the active eaten from werewolves attribute
    And the game's current play should be big-bad-wolf to eat

    When the big bad wolf eats the player named Juju
    Then the game's current play should be witch to use-potions

    When the witch uses death potion on the player named Antoine
    Then the player named Antoine should be murdered by witch from death-potion
    And the player named Juju should be murdered by big-bad-wolf from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the player named Olivia should have the active powerless from werewolves attribute
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter | target |
      | JB    | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a big-bad-wolf
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a big-bad-wolf and originally a devoted-servant
    And the player named JB should be on werewolves current side and originally be on villagers side
    And the player named JB should not have his role revealed
    And the player named JB should not have the active powerless from big-bad-wolf attribute
    And the game's current play should be werewolves to eat
    And the game's current play should be played by the following players
      | name |
      | JB   |

    When the werewolves eat the player named Doudou
    Then the game's current play should be big-bad-wolf to eat
    And the game's current play should be played by the following players
      | name |
      | JB   |

  Scenario: 🎀 Devoted Servant prevents scapegoat to ban from votes by stealing his role

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | scapegoat       |
      | JB      | devoted-servant |
      | Juju    | villager        |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target  |
      | Antoine | JB      |
      | JB      | Antoine |
    Then the player named Olivia should be murdered by survivors from vote-scapegoated
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a scapegoat
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a scapegoat and originally a devoted-servant
    And the player named JB should not have his role revealed
    And the game's current play should be werewolves to eat

  Scenario: 🎀 Devoted Servant steals the role of the white werewolf and wins

    Given a created game with options described in files no-sheriff-option.json, white-werewolf-waking-up-every-night-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | white-werewolf  |
      | JB      | devoted-servant |
      | Juju    | villager        |
      | Doudou  | villager        |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be white-werewolf to eat

    When the player or group skips his turn
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Olivia |
    Then the player named Olivia should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a white-werewolf
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a white-werewolf and originally a devoted-servant
    And the player named JB should be on werewolves current side and originally be on villagers side
    And the player named JB should not have his role revealed
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Doudou
    Then the game's current play should be white-werewolf to eat

    When the white werewolf eats the player named Antoine
    Then the player named Antoine should be murdered by white-werewolf from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be over
    And the game's winners should be white-werewolf with the following players
      | name |
      | JB   |

  Scenario: 🎀 Devoted Servant steals the role of angel and wins

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | angel           |
      | JB      | devoted-servant |
      | Juju    | hunter          |
    And the game's current play should be survivors to vote because angel-presence

    When the survivors vote with the following votes
      | voter   | target |
      | Antoine | Juju   |
    Then the player named Juju should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be hunter to shoot

    When the hunter shoots at the player named Olivia
    Then the player named Olivia should be murdered by hunter from shot
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a angel
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a angel and originally a devoted-servant
    And the player named JB should be on villagers current side and originally be on villagers side
    And the player named JB should not have his role revealed
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be over
    And the game's winners should be angel with the following players
      | name |
      | JB   |

  Scenario: 🎀 Devoted Servant steals the role of the pied piper and wins

    Given a created game with options described in files no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | pied-piper      |
      | JB      | devoted-servant |
      | Juju    | villager        |
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the game's current play should be pied-piper to charm

    When the pied piper charms the following players
      | name    |
      | JB      |
      | Antoine |
    Then the player named JB should have the active charmed from pied-piper attribute
    And the player named Antoine should have the active charmed from pied-piper attribute
    And the game's current play should be charmed to meet-each-other

    When the charmed people meet each other
    Then the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a pied-piper
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a pied-piper and originally a devoted-servant
    And the player named JB should be on villagers current side and originally be on villagers side
    And the player named JB should not have his role revealed
    And the player named JB should not have the active charmed from pied-piper attribute
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the game's current play should be pied-piper to charm

    When the pied piper charms the following players
      | name |
      | Juju |
    Then the player named Juju should have the active charmed from pied-piper attribute
    And the game's status should be over
    And the game's winners should be pied-piper with the following players
      | name |
      | JB   |

  Scenario: 🎀 Devoted Servant steals the role of the prejudiced manipulator and wins

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                   | group |
      | Antoine | prejudiced-manipulator | boy   |
      | Olivia  | werewolf               | girl  |
      | JB      | devoted-servant        | girl  |
      | Thomas  | villager               | boy   |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Antoine
    Then the player named Antoine should be currently a devoted-servant and originally a prejudiced-manipulator
    And the player named Antoine should have his role revealed
    And the player named JB should be currently a prejudiced-manipulator and originally a devoted-servant
    And the player named JB should be on villagers current side and originally be on villagers side
    And the player named JB should not have his role revealed
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter | target |
      | JB    | Thomas |
    Then the player named Thomas should be murdered by survivors from vote
    And the game's current play should be survivors to bury-dead-bodies

    When the player or group skips his turn
    Then the game's status should be over
    And the game's winners should be prejudiced-manipulator with the following players
      | name |
      | JB   |

  Scenario: 🎀 Devoted Servant will have her role revealed if she steals the role of villager-villager

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role              |
      | Antoine | werewolf          |
      | Olivia  | villager-villager |
      | JB      | devoted-servant   |
      | Juju    | villager          |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a villager-villager
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a villager-villager and originally a devoted-servant
    And the player named JB should be on villagers current side and originally be on villagers side
    And the player named JB should have his role revealed

  Scenario: 🎀 Devoted Servant prevents rusty sword knight to contaminate by stealing his role

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role               |
      | Antoine | werewolf           |
      | Olivia  | rusty-sword-knight |
      | JB      | devoted-servant    |
      | Juju    | villager           |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a rusty-sword-knight
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a rusty-sword-knight and originally a devoted-servant
    And the player named JB should be on villagers current side and originally be on villagers side
    And the player named JB should not have his role revealed
    And the player named Antoine should not have the active contaminated from rusty-sword-knight attribute
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the player named Antoine should have the active contaminated from rusty-sword-knight attribute
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the player named Antoine should be murdered by rusty-sword-knight from disease
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's status should be over

  Scenario: 🎀 Devoted Servant can choose between the thief cards if he didn't choose one

    Given a created game with additional cards described in file seer-werewolf-additional-cards-for-thief.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | thief           |
      | JB      | devoted-servant |
      | Juju    | villager        |
    Then the game's current play should be thief to choose-card

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a thief
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a thief and originally a devoted-servant
    And the player named JB should be on villagers current side and originally be on villagers side
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be thief to choose-card
    And the game's current play should be played by the following players
      | name |
      | JB   |

    When the thief chooses card with role seer
    Then the player named JB should be currently a seer and originally a devoted-servant
    And the player named JB should be on villagers current side and originally be on villagers side
    And the game's current play should be seer to look
    And the game's current play should be played by the following players
      | name |
      | JB   |

  Scenario: 🎀 Devoted Servant doesn't charm other players if there are already some in love

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | werewolf        |
      | Olivia  | cupid           |
      | JB      | devoted-servant |
      | Juju    | villager        |
    And the game's current play should be cupid to charm

    When the cupid shoots an arrow at the player named Antoine and the player named Juju
    Then the player named Antoine should have the active in-love from cupid attribute
    And the player named Juju should have the active in-love from cupid attribute
    And the game's current play should be lovers to meet-each-other

    When the lovers meet each other
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Olivia
    Then the player named Olivia should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Olivia
    Then the player named Olivia should be currently a devoted-servant and originally a cupid
    And the player named Olivia should have his role revealed
    And the player named JB should be currently a cupid and originally a devoted-servant
    And the player named JB should be on villagers current side and originally be on villagers side
    And the player named JB should not have his role revealed
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

  Scenario: 🎀 Devoted Servant steals the actor role if he didn't choose a card and thus can choose unused actor cards

    Given a created game with additional cards described in file seer-witch-little-girl-additional-cards-for-actor.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | actor           |
      | Olivia  | werewolf        |
      | JB      | devoted-servant |
      | Thomas  | villager        |
    Then the game's current play should be actor to choose-card

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Antoine
    Then the player named Antoine should be currently a devoted-servant and originally a actor
    And the player named Antoine should have his role revealed
    And the player named JB should be currently a actor and originally a devoted-servant
    And the player named JB should be on villagers current side and originally be on villagers side
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be actor to choose-card
    And the game's current play should be played by the following players
      | name |
      | JB   |
    When the actor chooses card with role seer
    Then the player named JB should be currently a seer and originally a devoted-servant
    And the player named JB should have the active acting from actor attribute
    And the player named JB should be on villagers current side and originally be on villagers side
    And the game's current play should be seer to look
    And the game's current play should be played by the following players
      | name |
      | JB   |

    When the seer looks at the player named Olivia
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the player named JB should be currently a actor and originally a devoted-servant
    And the player named JB should not have the active acting from actor attribute

  Scenario: 🎀 Devoted Servant can't use a card the actor previously used

    Given a created game with additional cards described in file seer-witch-little-girl-additional-cards-for-actor.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | actor           |
      | Olivia  | werewolf        |
      | JB      | devoted-servant |
      | Thomas  | villager        |
    Then the game's current play should be actor to choose-card

    When the actor chooses card with role little-girl
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be actor to choose-card

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Antoine
    Then the player named Antoine should be currently a devoted-servant and originally a actor
    And the player named Antoine should have his role revealed
    And the player named JB should be currently a actor and originally a devoted-servant
    And the player named JB should be on villagers current side and originally be on villagers side
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be actor to choose-card

    When the actor chooses card with role little-girl
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception message should be "Bad game play payload"
    And the request exception error should be "Chosen card is already used"

  Scenario: 🎀 Devoted Servant idiot role is revealed if he was revealed before

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role            |
      | Antoine | idiot           |
      | Olivia  | werewolf        |
      | JB      | devoted-servant |
      | Thomas  | villager        |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter | target  |
      | JB    | Antoine |
    Then the player named Antoine should be alive
    And the player named Antoine should have his role revealed
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should be murdered by werewolves from eaten
    And the player named Antoine should have his role revealed
    And the game's current play should be survivors to bury-dead-bodies

    When the devoted servant steals the role of the player named Antoine
    Then the player named Antoine should be currently a devoted-servant and originally a idiot
    And the player named Antoine should have his role revealed
    And the player named JB should be currently a idiot and originally a devoted-servant
    And the player named JB should be on villagers current side and originally be on villagers side
    And the player named JB should have his role revealed