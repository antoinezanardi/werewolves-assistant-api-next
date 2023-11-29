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
      | name    | role                  |
      | Antoine | werewolf              |
      | Olivia  | vile-father-of-wolves |
      | JB      | big-bad-wolf          |
      | Thomas  | white-werewolf        |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                   |
      | one of the players.role must have at least one role from `villagers` side |

  Scenario: 🎲 Game can't be created without werewolves

    Given a created game with the following players
      | name    | role     |
      | Antoine | seer     |
      | Olivia  | witch    |
      | JB      | idiot    |
      | Thomas  | dog-wolf |
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
      | message                                                                                                                                                                                                                                                                                                                                                                 |
      | players.4.role.name must be one of the following values: werewolf, big-bad-wolf, vile-father-of-wolves, white-werewolf, villager, villager-villager, seer, cupid, witch, hunter, little-girl, defender, elder, scapegoat, idiot, two-sisters, three-brothers, fox, bear-tamer, stuttering-judge, rusty-sword-knight, thief, wild-child, dog-wolf, angel, pied-piper, scandalmonger |

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
      | Antoine | defender    |
      | Olivia  | defender    |
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
      | message                                                            |
      | additionalCards must be set if there is a player with role `thief` |

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

  Scenario: 🎲 Game can't be created if there are two dog-wolves

    Given a created game with the following players
      | name    | role     |
      | Antoine | dog-wolf |
      | Olivia  | dog-wolf |
      | JB      | idiot    |
      | Thomas  | werewolf |
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
      | name    | role     |
      | Antoine | scandalmonger    |
      | Olivia  | scandalmonger    |
      | JB      | idiot    |
      | Thomas  | werewolf |
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

  Scenario: 🎲 Game can't be created if there are two vile father of wolves

    Given a created game with the following players
      | name    | role                  |
      | Antoine | vile-father-of-wolves |
      | Olivia  | vile-father-of-wolves |
      | JB      | idiot                 |
      | Thomas  | werewolf              |
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                                                                |
      | players.role can't exceed role maximum occurrences in game. Please check `maxInGame` property of roles |