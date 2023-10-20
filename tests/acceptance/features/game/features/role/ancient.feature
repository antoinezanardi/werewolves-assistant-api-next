@ancient-role

Feature: 👴🏻 Ancient role

  Scenario: 👴🏻 Ancient makes all villagers loose powers if he dies from votes

    Given a created game with additional cards described in file full-werewolves-additional-cards-for-thief.json and with options described in file no-sheriff-option.json and with the following players
      | name      | role                  |
      | Antoine   | ancient               |
      | Juju      | seer                  |
      | Doudou    | cupid                 |
      | JB        | vile-father-of-wolves |
      | Olivia    | werewolf              |
      | Thomas    | witch                 |
      | Romain    | hunter                |
      | Ludo      | guard                 |
      | Benedicte | scapegoat             |
      | Alex      | idiot                 |
      | Alexis    | fox                   |
      | Vanessa   | bear-tamer            |
      | Cari      | stuttering-judge      |
      | Aurelien  | rusty-sword-knight    |
      | Leo       | wild-child            |
      | Sarah     | dog-wolf              |
      | Babou     | thief                 |
      | Ali       | angel                 |
      | Pedro     | pied-piper            |
      | Pierre    | raven                 |
    Then the request should have succeeded with status code 201
    And the game's current play should be survivors to vote because angel-presence

    When the survivors vote with the following votes
      | voter  | target  |
      | Olivia | Antoine |
    Then the player named Antoine should be murdered by survivors from vote
    And the following players should have the active powerless from ancient attribute
      | name      |
      | Juju      |
      | Doudou    |
      | Thomas    |
      | Romain    |
      | Ludo      |
      | Benedicte |
      | Alex      |
      | Alexis    |
      | Vanessa   |
      | Cari      |
      | Aurelien  |
      | Leo       |
      | Sarah     |
      | Babou     |
      | Ali       |
      | Pedro     |
      | Pierre    |
    And the following players should not have the active powerless from ancient attribute
      | name    |
      | Antoine |
      | Olivia  |
      | JB      |
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Ali
    Then the player named Ali should be murdered by werewolves from eaten
    And the game's status should be playing
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | Olivia | Alex   |
    Then the player named Alex should be murdered by survivors from vote
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Romain
    Then the player named Romain should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Aurelien
    Then the player named Aurelien should be murdered by werewolves from eaten
    And nobody should have the active contaminated from rusty-sword-night attribute

  Scenario: 👴🏻 Ancient makes all villagers loose powers if he dies from the witch

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | ancient  |
      | Juju    | werewolf |
      | Doudou  | witch    |
      | JB      | guard    |
      | Thomas  | idiot    |
    Then the game's current play should be guard to protect

    When the guard protects the player named JB
    Then the player named JB should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the witch uses death potion on the player named Antoine
    Then the player named Antoine should be murdered by witch from death-potion
    And the following players should have the active powerless from ancient attribute
      | name   |
      | Doudou |
      | JB     |
      | Thomas |

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat

  Scenario: 👴🏻 Ancient makes all villagers loose powers if he dies from the hunter

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | ancient  |
      | Juju    | werewolf |
      | Doudou  | idiot    |
      | JB      | guard    |
      | Thomas  | hunter   |
    Then the game's current play should be guard to protect

    When the guard protects the player named JB
    Then the player named JB should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be hunter to shoot

    When the hunter shoots at the player named Antoine
    Then the player named Antoine should be murdered by hunter from shot
    And the following players should have the active powerless from ancient attribute
      | name   |
      | Doudou |
      | JB     |

    When the player or group skips his turn
    Then the game's current play should be werewolves to eat


  Scenario: 👴🏻 Ancient doesn't makes all villagers loose powers if he dies from villagers with the right option

    Given a created game with options described in file no-sheriff-option.json, ancient-doesnt-take-revenge-option.json and with the following players
      | name    | role     |
      | Antoine | ancient  |
      | Juju    | werewolf |
      | Doudou  | angel    |
      | JB      | guard    |
    Then the game's current play should be survivors to vote because angel-presence

    When the survivors vote with the following votes
      | voter  | target  |
      | Doudou | Antoine |
    Then the player named Antoine should be murdered by survivors from vote
    And nobody should have the active powerless from ancient attribute
    And the game's current play should be guard to protect

  Scenario: 👴🏻 Ancient has two lives against werewolves

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | ancient  |
      | Juju    | werewolf |
      | Doudou  | witch    |
      | JB      | guard    |
    Then the game's current play should be guard to protect

    When the guard protects the player named JB
    Then the player named JB should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the witch uses life potion on the player named Antoine
    Then the player named Antoine should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be guard to protect

    When the guard protects the player named Juju
    Then the player named Juju should have the active protected from guard attribute

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the player named Antoine should be alive
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be guard to protect

    When the guard protects the player named Antoine
    Then the player named Antoine should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the game's current play should be survivors to vote
    And the player named Antoine should be alive

    When the player or group skips his turn
    Then the game's current play should be guard to protect

    When the guard protects the player named JB
    Then the player named JB should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the player named Antoine should be murdered by werewolves from eaten
    And nobody should have the active powerless from ancient attribute

  Scenario: 👴🏻 Ancient has only one life against werewolves with the right option

    Given a created game with options described in file no-sheriff-option.json, ancient-one-life-against-werewolves-option.json and with the following players
      | name    | role     |
      | Antoine | ancient  |
      | Juju    | werewolf |
      | Doudou  | witch    |
      | JB      | guard    |
    Then the game's current play should be guard to protect

    When the guard protects the player named JB
    Then the player named JB should have the active protected from guard attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Antoine
    Then the player named Antoine should have the active eaten from werewolves attribute
    And the game's current play should be witch to use-potions

    When the player or group skips his turn
    Then the player named Antoine should be murdered by werewolves from eaten