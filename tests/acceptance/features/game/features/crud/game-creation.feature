@game-creation

Feature: 🎲 Game Creation

  Scenario: 🎲 Game is created

    Given a created game with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | JB      | villager |
      | Thomas  | villager |
    Then the request should have succeeded with status code 201

  Scenario: 🎲 Game can't be created with less than 4 players

    Given a created game with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | JB      | villager |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                  |
      | players must contain at least 4 elements |

  Scenario: 🎲 Game can't be created with more than 40 players

    Given a created game with the following players
      | name     | role     |
      | Antoine  | villager |
      | Olivia   | werewolf |
      | JB       | villager |
      | Thomas   | villager |
      | Jack     | villager |
      | John     | villager |
      | Jane     | villager |
      | James    | villager |
      | Jean     | villager |
      | Jules    | villager |
      | Jade     | villager |
      | Maxime   | villager |
      | Max      | villager |
      | Maxence  | villager |
      | Toto     | villager |
      | Titi     | villager |
      | Tata     | villager |
      | Tete     | villager |
      | Aurelien | villager |
      | Aurelia  | villager |
      | Aurelie  | villager |
      | Aurel    | villager |
      | Aure     | villager |
      | Aur      | villager |
      | Au       | villager |
      | Damien   | villager |
      | Dorian   | villager |
      | Doriane  | villager |
      | Dori     | villager |
      | Dor      | villager |
      | Do       | villager |
      | Valois   | villager |
      | Val      | villager |
      | Va       | villager |
      | Lolo     | villager |
      | Lala     | villager |
      | Lili     | villager |
      | Lulu     | villager |
      | Dad      | villager |
      | Mom      | villager |
      | Baby     | villager |
      | Dog      | villager |
      | Cat      | villager |
      | Fish     | villager |
      | Bird     | villager |
      | Mouse    | villager |
      | Cow      | villager |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                       |
      | players must contain no more than 40 elements |

  Scenario: 🎲 Game can't be created without villagers

    Given a created game with the following players
      | name    | role                 |
      | Antoine | werewolf             |
      | Olivia  | accursed-wolf-father |
      | JB      | big-bad-wolf         |
      | Thomas  | white-werewolf       |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                   |
      | one of the players.role must have at least one role from `villagers` side |

  Scenario: 🎲 Game can't be created without werewolves

    Given a created game with the following players
      | name    | role       |
      | Antoine | seer       |
      | Olivia  | witch      |
      | JB      | idiot      |
      | Thomas  | wolf-hound |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                    |
      | one of the players.role must have at least one role from `werewolves` side |

  Scenario: 🎲 Game can't be created if one of the player name is too long

    Given a created game with the following players
      | name                                                                          | role     |
      | AntoineAntoineAntoineAntoineAntoineAntoineAntoineAntoineAntoineAntoineAntoine | seer     |
      | Olivia                                                                        | witch    |
      | JB                                                                            | idiot    |
      | Thomas                                                                        | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                       |
      | players.0.name must be shorter than or equal to 30 characters |

  Scenario: 🎲 Game can't be created if two players have the same name

    Given a created game with the following players
      | name    | role     |
      | Antoine | seer     |
      | Antoine | witch    |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                     |
      | players.name must be unique |

  Scenario: 🎲 Game can't be created if one of the player role is unknown

    Given a created game with the following players
      | name    | role     |
      | Antoine | seer     |
      | Olivia  | witch    |
      | JB      | idiot    |
      | Thomas  | werewolf |
      | Toto    | unknown  |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                                                                                                                                                                                                                                                                                                                                             |
      | players.4.role.name must be one of the following values: werewolf, big-bad-wolf, accursed-wolf-father, white-werewolf, villager, villager-villager, seer, cupid, witch, hunter, little-girl, defender, elder, scapegoat, idiot, two-sisters, three-brothers, fox, bear-tamer, stuttering-judge, rusty-sword-knight, thief, wild-child, wolf-hound, angel, pied-piper, scandalmonger, prejudiced-manipulator, actor, devoted-servant |

  Scenario: 🎲 Game can't be created if there is only one of the two sisters

    Given a created game with the following players
      | name    | role        |
      | Antoine | seer        |
      | Olivia  | witch       |
      | JB      | idiot       |
      | Thomas  | werewolf    |
      | Toto    | two-sisters |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                              |
      | players.role minimum occurrences in game must be reached. Please check `minInGame` property of roles |

  Scenario: 🎲 Game can't be created if there is only one of the three brothers

    Given a created game with the following players
      | name    | role           |
      | Antoine | seer           |
      | Olivia  | witch          |
      | JB      | idiot          |
      | Thomas  | werewolf       |
      | Toto    | three-brothers |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                              |
      | players.role minimum occurrences in game must be reached. Please check `minInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are only two of the three brothers

    Given a created game with the following players
      | name    | role           |
      | Antoine | seer           |
      | Olivia  | witch          |
      | JB      | idiot          |
      | Thomas  | werewolf       |
      | Toto    | three-brothers |
      | Titi    | three-brothers |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                              |
      | players.role minimum occurrences in game must be reached. Please check `minInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two seers

    Given a created game with the following players
      | name    | role     |
      | Antoine | seer     |
      | Olivia  | seer     |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two villager-villagers

    Given a created game with the following players
      | name    | role              |
      | Antoine | villager-villager |
      | Olivia  | villager-villager |
      | JB      | idiot             |
      | Thomas  | werewolf          |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two cupids

    Given a created game with the following players
      | name    | role     |
      | Antoine | cupid    |
      | Olivia  | cupid    |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two witches

    Given a created game with the following players
      | name    | role     |
      | Antoine | witch    |
      | Olivia  | witch    |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two hunters

    Given a created game with the following players
      | name    | role     |
      | Antoine | hunter   |
      | Olivia  | hunter   |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two little girls

    Given a created game with the following players
      | name    | role        |
      | Antoine | little-girl |
      | Olivia  | little-girl |
      | JB      | idiot       |
      | Thomas  | werewolf    |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two defenders

    Given a created game with the following players
      | name    | role     |
      | Antoine | defender |
      | Olivia  | defender |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two elders

    Given a created game with the following players
      | name    | role     |
      | Antoine | elder    |
      | Olivia  | elder    |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two scapegoats

    Given a created game with the following players
      | name    | role      |
      | Antoine | scapegoat |
      | Olivia  | scapegoat |
      | JB      | idiot     |
      | Thomas  | werewolf  |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two foxes

    Given a created game with the following players
      | name    | role     |
      | Antoine | fox      |
      | Olivia  | fox      |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two bear tamers

    Given a created game with the following players
      | name    | role       |
      | Antoine | bear-tamer |
      | Olivia  | bear-tamer |
      | JB      | idiot      |
      | Thomas  | werewolf   |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two stuttering judges

    Given a created game with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Olivia  | stuttering-judge |
      | JB      | idiot            |
      | Thomas  | werewolf         |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two rusty sword knights

    Given a created game with the following players
      | name    | role               |
      | Antoine | rusty-sword-knight |
      | Olivia  | rusty-sword-knight |
      | JB      | idiot              |
      | Thomas  | werewolf           |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two thieves

    Given a created game with additional cards described in file full-werewolves-additional-cards-for-thief.json and with the following players
      | name    | role     |
      | Antoine | thief    |
      | Olivia  | thief    |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                            |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles             |
      | additionalCards.roleName can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are no additional cards for thief

    Given a created game with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | thief    |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                        |
      | additionalCards must be set if there is a player with one of the following roles : thief,actor |

  Scenario: 🎲 Game can't be created if there are too less additional cards for thief

    Given a created game with additional cards described in file one-additional-card-for-thief.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | thief    |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                    |
      | additionalCards length for thief must be equal to options.roles.thief.additionalCardsCount |

  Scenario: 🎲 Game can't be created if there are too much additional cards for thief

    Given a created game with additional cards described in file five-additional-cards-for-thief.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | thief    |
      | JB      | villager |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                    |
      | additionalCards length for thief must be equal to options.roles.thief.additionalCardsCount |

  Scenario: 🎲 Game can't be created if one additional card can't be given to thief

    Given a created game with additional cards described in file invalid-additional-cards-for-thief.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | thief    |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                                                                                                                                                                                                                                                                                        |
      | additionalCards.roleName for thief must be one of the following values: werewolf,big-bad-wolf,accursed-wolf-father,white-werewolf,villager,villager-villager,seer,cupid,witch,hunter,little-girl,defender,elder,scapegoat,idiot,fox,bear-tamer,stuttering-judge,rusty-sword-knight,wild-child,wolf-hound,angel,pied-piper,scandalmonger,prejudiced-manipulator,devoted-servant |

  Scenario: 🎲 Game can't be created if there are two wild children

    Given a created game with the following players
      | name    | role       |
      | Antoine | wild-child |
      | Olivia  | wild-child |
      | JB      | idiot      |
      | Thomas  | werewolf   |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two wolf-hounds

    Given a created game with the following players
      | name    | role       |
      | Antoine | wolf-hound |
      | Olivia  | wolf-hound |
      | JB      | idiot      |
      | Thomas  | werewolf   |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two angels

    Given a created game with the following players
      | name    | role     |
      | Antoine | angel    |
      | Olivia  | angel    |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two pied pipers

    Given a created game with the following players
      | name    | role       |
      | Antoine | pied-piper |
      | Olivia  | pied-piper |
      | JB      | idiot      |
      | Thomas  | werewolf   |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two scandalmongers

    Given a created game with the following players
      | name    | role          |
      | Antoine | scandalmonger |
      | Olivia  | scandalmonger |
      | JB      | idiot         |
      | Thomas  | werewolf      |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two big bad wolves

    Given a created game with the following players
      | name    | role         |
      | Antoine | big-bad-wolf |
      | Olivia  | big-bad-wolf |
      | JB      | idiot        |
      | Thomas  | werewolf     |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two accursed wolf-father

    Given a created game with the following players
      | name    | role                 |
      | Antoine | accursed-wolf-father |
      | Olivia  | accursed-wolf-father |
      | JB      | idiot                |
      | Thomas  | werewolf             |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there are two prejudiced manipulator

    Given a created game with the following players
      | name    | role                   | group |
      | Antoine | prejudiced-manipulator | boy   |
      | Olivia  | prejudiced-manipulator | boy   |
      | JB      | idiot                  | girl  |
      | Thomas  | werewolf               | girl  |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |

  Scenario: 🎲 Game can't be created if there is a prejudiced manipulator but one player doesn't have a group

    Given a created game with the following players
      | name    | role                   |
      | Antoine | prejudiced-manipulator |
      | Olivia  | villager               |
      | JB      | idiot                  |
      | Thomas  | werewolf               |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                  |
      | there must be exactly two groups among players when `prejudiced-manipulator` in the game |
      | each player must have a group if there is a player with role `prejudiced-manipulator`    |

  Scenario: 🎲 Game can't be created if there is a prejudiced manipulator but one player has a group with empty name

    Given a created game with the following players
      | name    | role                   | group |
      | Antoine | prejudiced-manipulator | boy   |
      | Olivia  | villager               | boy   |
      | JB      | idiot                  |       |
      | Thomas  | werewolf               |       |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                      |
      | players.2.group must be longer than or equal to 1 characters |
      | players.3.group must be longer than or equal to 1 characters |

  Scenario: 🎲 Game can't be created if there is a prejudiced manipulator but one player has a group with too long name

    Given a created game with the following players
      | name    | role                   | group                                |
      | Antoine | prejudiced-manipulator | boy                                  |
      | Olivia  | villager               | boy                                  |
      | JB      | idiot                  | ImTheLongestNameForAGroupYouEverSeen |
      | Thomas  | werewolf               | ImTheLongestNameForAGroupYouEverSeen |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                        |
      | players.2.group must be shorter than or equal to 30 characters |
      | players.3.group must be shorter than or equal to 30 characters |

  Scenario: 🎲 Game can't be created if there is a prejudiced manipulator but there is only one group among players

    Given a created game with the following players
      | name    | role                   | group |
      | Antoine | prejudiced-manipulator | boy   |
      | Olivia  | villager               | boy   |
      | JB      | idiot                  | boy   |
      | Thomas  | werewolf               | boy   |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                  |
      | there must be exactly two groups among players when `prejudiced-manipulator` in the game |

  Scenario: 🎲 Game can't be created if there is a prejudiced manipulator but there are more than groups among players

    Given a created game with the following players
      | name    | role                   | group |
      | Antoine | prejudiced-manipulator | boy   |
      | Olivia  | villager               | boy   |
      | JB      | idiot                  | girl  |
      | Thomas  | werewolf               | alien |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                  |
      | there must be exactly two groups among players when `prejudiced-manipulator` in the game |

  Scenario: 🎲 Game can't be created if there is no prejudiced manipulator but there are groups among players

    Given a created game with the following players
      | name    | role     | group |
      | Antoine | werewolf | boy   |
      | Olivia  | villager | boy   |
      | JB      | idiot    | girl  |
      | Thomas  | werewolf | girl  |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                |
      | any player can't have a group if there is no player with role `prejudiced-manipulator` |

  Scenario: 🎲 Game can't be created if there are no additional cards for actor

    Given a created game with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | actor    |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                        |
      | additionalCards must be set if there is a player with one of the following roles : thief,actor |

  Scenario: 🎲 Game can't be created if there are too less additional cards for actor

    Given a created game with additional cards described in file one-additional-card-for-actor.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | actor    |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                    |
      | additionalCards length for actor must be equal to options.roles.actor.additionalCardsCount |

  Scenario: 🎲 Game can't be created if there are too much additional cards for actor

    Given a created game with additional cards described in file five-additional-cards-for-actor.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | actor    |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                    |
      | additionalCards length for actor must be equal to options.roles.actor.additionalCardsCount |

  Scenario: 🎲 Game can't be created if one additional card can't be given to actor

    Given a created game with additional cards described in file invalid-additional-cards-for-actor.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | actor    |
      | JB      | idiot    |
      | Thomas  | werewolf |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                                                                                                                                                            |
      | additionalCards.roleName for actor must be one of the following values: seer,cupid,witch,hunter,little-girl,defender,elder,scapegoat,idiot,fox,bear-tamer,stuttering-judge,rusty-sword-knight,wild-child,wolf-hound,angel,pied-piper,scandalmonger |