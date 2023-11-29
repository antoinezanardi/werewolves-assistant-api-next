@game-history

Feature: 📜 Game History

  Scenario: 📜 Game's tick, phase and turn are recorded in the game history

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Juju    | villager |
      | Doudou  | werewolf |
      | JB      | villager |
      | Thomas  | villager |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    And the most recent history record is retrieved
    Then the game's tick from the previous history record should be 1
    And the game's phase from the previous history record should be night
    And the game's turn from the previous history record should be 1
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    And the most recent history record is retrieved
    Then the game's tick from the previous history record should be 2
    And the game's phase from the previous history record should be day
    And the game's turn from the previous history record should be 1
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | name   | vote   |
      | JB     | Juju   |
      | Juju   | Doudou |
      | Doudou | Juju   |
    And the most recent history record is retrieved
    Then the game's tick from the previous history record should be 3
    And the game's phase from the previous history record should be day
    And the game's turn from the previous history record should be 1
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    And the most recent history record is retrieved
    Then the game's tick from the previous history record should be 4
    And the game's phase from the previous history record should be day
    And the game's turn from the previous history record should be 1
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named JB
    And the most recent history record is retrieved
    Then the game's tick from the previous history record should be 5
    And the game's phase from the previous history record should be night
    And the game's turn from the previous history record should be 2

  Scenario: 📜 Game play's action, sources and cause are recorded in the game history

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Juju    | angel            |
      | Doudou  | werewolf         |
      | Babou   | werewolf         |
      | JB      | seer             |
      | Thomas  | raven            |
    Then the game's current play should be survivors to vote because angel-presence

    When the survivors vote with the following votes
      | name    | vote   |
      | JB      | Juju   |
      | Juju    | Doudou |
      | Doudou  | Juju   |
      | Antoine | Doudou |
    And the most recent history record is retrieved
    Then the play's action from the previous history record should be vote
    And the play's source players from the previous history record should be the following players
      | name    |
      | Antoine |
      | Juju    |
      | Doudou  |
      | Babou   |
      | JB      |
      | Thomas  |
    And the play's source name from the previous history record should be survivors
    And the play's cause from the previous history record should be angel-presence
    And the game's current play should be survivors to vote because previous-votes-were-in-ties

    When the survivors vote with the following votes
      | name    | vote   |
      | JB      | Juju   |
      | Juju    | Doudou |
      | Antoine | Doudou |
    And the most recent history record is retrieved
    Then the play's action from the previous history record should be vote
    And the play's source players from the previous history record should be the following players
      | name    |
      | Antoine |
      | Juju    |
      | Doudou  |
      | Babou   |
      | JB      |
      | Thomas  |
    And the play's source name from the previous history record should be survivors
    And the play's cause from the previous history record should be previous-votes-were-in-ties
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    And the most recent history record is retrieved
    Then the play's action from the previous history record should be bury-dead-bodies
    And the play's source name from the previous history record should be survivors
    And the play's source players from the previous history record should be the following players
      | name    |
      | Antoine |
      | Juju    |
      | Babou   |
      | JB      |
      | Thomas  |
    And the play's cause from the previous history record should be undefined
    And the game's current play should be seer to look

    When the seer looks at the player named Thomas
    And the most recent history record is retrieved
    Then the play's action from the previous history record should be look
    And the play's source players from the previous history record should be the following players
      | name |
      | JB   |
    And the play's source name from the previous history record should be seer
    And the play's cause from the previous history record should be undefined
    And the game's current play should be stuttering-judge to choose-sign

    When the stuttering judge chooses his sign
    And the most recent history record is retrieved
    Then the play's action from the previous history record should be choose-sign
    And the play's source players from the previous history record should be the following players
      | name    |
      | Antoine |
    And the play's source name from the previous history record should be stuttering-judge
    And the play's cause from the previous history record should be undefined
    And the game's current play should be raven to mark

    When the player or group skips his turn
    And the most recent history record is retrieved
    Then the play's action from the previous history record should be mark
    And the play's source players from the previous history record should be the following players
      | name   |
      | Thomas |
    And the play's source name from the previous history record should be raven
    And the play's cause from the previous history record should be undefined
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    And the most recent history record is retrieved
    Then the play's action from the previous history record should be eat
    And the play's source players from the previous history record should be the following players
      | name  |
      | Babou |
    And the play's source name from the previous history record should be werewolves
    And the play's cause from the previous history record should be undefined
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    And the most recent history record is retrieved
    Then the play's action from the previous history record should be bury-dead-bodies
    And the play's source players from the previous history record should be the following players
      | name    |
      | Antoine |
      | Juju    |
      | Babou   |
      | JB      |
    And the play's source name from the previous history record should be survivors
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes and the stuttering judge does his sign
      | name    | vote |
      | Antoine | Juju |
    And the most recent history record is retrieved
    Then the play's action from the previous history record should be vote
    And the play's source players from the previous history record should be the following players
      | name    |
      | Antoine |
      | Juju    |
      | Babou   |
      | JB      |
    And the play's source name from the previous history record should be survivors
    And the play's cause from the previous history record should be undefined
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    And the most recent history record is retrieved
    Then the play's action from the previous history record should be bury-dead-bodies
    And the play's source players from the previous history record should be the following players
      | name    |
      | Antoine |
      | Babou   |
      | JB      |
    And the play's source name from the previous history record should be survivors
    And the game's current play should be survivors to vote because stuttering-judge-request

    When the survivors vote with the following votes
      | name    | vote |
      | Antoine | JB   |
    And the most recent history record is retrieved
    Then the play's action from the previous history record should be vote
    And the play's source players from the previous history record should be the following players
      | name    |
      | Antoine |
      | Babou   |
      | JB      |
    And the play's source name from the previous history record should be survivors
    And the play's cause from the previous history record should be stuttering-judge-request

  Scenario: 📜 Targets of various roles actions are recorded in the game history

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role                  |
      | Antoine | seer                  |
      | Juju    | witch                 |
      | Doudou  | vile-father-of-wolves |
      | JB      | defender                 |
      | Thomas  | raven                 |
    Then the game's current play should be seer to look

    When the seer looks at the player named Juju
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be the following players
      | name |
      | Juju |
    And the game's current play should be raven to mark

    When the player or group skips his turn
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be undefined
    And the game's current play should be defender to protect

    When the defender protects the player named JB
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be the following players
      | name |
      | JB   |
    And the play's votes from the previous history record should be undefined
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be the following players
      | name    |
      | Antoine |
    And the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Antoine and death potion on the player named JB
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be the following players
      | name    |
      | Antoine |
      | JB      |
    And the play's target named Antoine from the previous history record should have drunk the life potion
    And the play's target named JB from the previous history record should have drunk the death potion
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be undefined
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be undefined
    And the game's current play should be seer to look

    When the seer looks at the player named Thomas
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be the following players
      | name   |
      | Thomas |
    And the game's current play should be raven to mark

    When the player or group skips his turn
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be undefined
    And the game's current play should be werewolves to eat

    When the vile father of wolves infects the player named Thomas
    And the most recent history record is retrieved
    Then the play's targets from the previous history record should be the following players
      | name   |
      | Thomas |
    And the play's target named Thomas from the previous history record should be infected

  Scenario: 📜 Votes of various roles actions are recorded in the game history

    Given a created game with the following players
      | name    | role             |
      | Antoine | stuttering-judge |
      | Juju    | idiot            |
      | Doudou  | villager         |
      | JB      | werewolf         |
      | Thomas  | villager         |
      | Morgan  | villager         |
      | Damien  | villager         |
      | Hippo   | villager         |
    Then the game's current play should be survivors to elect-sheriff

    When the survivors elect sheriff with the following votes
      | name   | vote   |
      | JB     | Juju   |
      | Juju   | Doudou |
      | Doudou | Juju   |
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be the following votes
      | name   | vote   |
      | JB     | Juju   |
      | Juju   | Doudou |
      | Doudou | Juju   |
    And the play's voting result from the previous history record should be sheriff-election
    And the play's nominated players from votes of the previous history record should be the following players
      | name |
      | Juju |
    And the play's targets from the previous history record should be undefined
    And the game's current play should be stuttering-judge to choose-sign

    When the stuttering judge chooses his sign
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be undefined
    Then the play's targets from the previous history record should be undefined
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be undefined
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be undefined
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes and the stuttering judge does his sign
      | name   | vote   |
      | JB     | Juju   |
      | Juju   | Doudou |
      | Doudou | Juju   |
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be the following votes
      | name   | vote   |
      | JB     | Juju   |
      | Juju   | Doudou |
      | Doudou | Juju   |
    And the play's voting result from the previous history record should be tie
    And the play's nominated players from votes of the previous history record should be the following players
      | name   |
      | Juju   |
      | Doudou |
    And the play's from the previous history record should have the stuttering judge request
    And the game's current play should be sheriff to settle-votes

    When the sheriff breaks the tie in votes by choosing the player named Doudou
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be undefined
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be undefined
    And the game's current play should be survivors to vote because stuttering-judge-request

    When the survivors vote with the following votes
      | name | vote |
      | JB   | Juju |
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be the following votes
      | name | vote |
      | JB   | Juju |
    And the play's voting result from the previous history record should be inconsequential
    And the play's nominated players from votes of the previous history record should be the following players
      | name |
      | Juju |
    And the play's from the previous history record should not have the stuttering judge request
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | name    | vote    |
      | JB      | Antoine |
      | Antoine | JB      |
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be the following votes
      | name    | vote    |
      | JB      | Antoine |
      | Antoine | JB      |
    And the play's voting result from the previous history record should be tie
    And the play's nominated players from votes of the previous history record should be the following players
      | name    |
      | Antoine |
      | JB      |
    And the game's current play should be survivors to vote because previous-votes-were-in-ties

    When the survivors vote with the following votes
      | name    | vote    |
      | JB      | Antoine |
      | Antoine | JB      |
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be the following votes
      | name    | vote    |
      | JB      | Antoine |
      | Antoine | JB      |
    And the play's voting result from the previous history record should be inconsequential
    And the play's nominated players from votes of the previous history record should be the following players
      | name    |
      | Antoine |
      | JB      |
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Morgan
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | name | vote    |
      | JB   | Antoine |
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be the following votes
      | name | vote    |
      | JB   | Antoine |
    And the play's voting result from the previous history record should be death
    And the play's nominated players from votes of the previous history record should be the following players
      | name    |
      | Antoine |
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Damien
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the player or group skips his turn
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be undefined
    And the play's voting result from the previous history record should be skipped

  Scenario: 📜 Chosen cards are recorded in the game history

    Given a created game with additional cards described in file seer-werewolf-additional-cards-for-thief.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | thief    |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | witch    |
    Then the game's current play should be thief to choose-card

    When the thief chooses card with role seer
    And the most recent history record is retrieved
    Then the play's chosen card from the previous history record should be the card with role seer

  Scenario: 📜 Chosen cards are not recorded in the game history when the thief does not choose a card
    Given a created game with additional cards described in file seer-werewolf-additional-cards-for-thief.json and with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | thief    |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | witch    |
    Then the game's current play should be thief to choose-card

    When the player or group skips his turn
    And the most recent history record is retrieved
    Then the play's chosen card from the previous history record should be undefined

  Scenario: 📜 Chosen side is recorded in the game history
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | dog-wolf |
      | Olivia  | villager |
      | JB      | werewolf |
      | Thomas  | witch    |
    Then the game's current play should be dog-wolf to choose-side

    When the dog wolf chooses the werewolves side
    And the most recent history record is retrieved
    Then the play's chosen side from the previous history record should be the werewolves side

  Scenario: 📜 Revealed players are recorded in the game history

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | idiot    |
      | Juju    | villager |
      | Doudou  | werewolf |
      | JB      | villager |
      | Thomas  | villager |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    Then the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | name | vote    |
      | JB   | Antoine |
    And the most recent history record is retrieved
    Then the play's votes from the previous history record should be the following votes
      | name | vote    |
      | JB   | Antoine |
    And the play's voting result from the previous history record should be inconsequential
    And the play's nominated players from votes of the previous history record should be the following players
      | name    |
      | Antoine |
    And the revealed players from the previous history record should be the following players
      | name    |
      | Antoine |
    And the dead players from the previous history record should be undefined

  Scenario: 📜 Dead players are recorded in the game history

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Juju    | cupid    |
      | Doudou  | werewolf |
      | JB      | villager |
      | Thomas  | villager |
    Then the game's current play should be cupid to charm

    When the cupid shoots an arrow at the player named Thomas and the player named JB
    Then the game's current play should be lovers to meet-each-other

    When the lovers meet each other
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Juju
    And the most recent history record is retrieved
    Then the dead players from the previous history record should be the following players
      | name |
      | Juju |
    And the revealed players from the previous history record should be undefined
    And the game's current play should be survivors to bury-dead-bodies

    When the survivors bury dead bodies
    Then the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | name    | vote |
      | Antoine | JB   |
    And the most recent history record is retrieved
    Then the dead players from the previous history record should be the following players
      | name   |
      | JB     |
      | Thomas |