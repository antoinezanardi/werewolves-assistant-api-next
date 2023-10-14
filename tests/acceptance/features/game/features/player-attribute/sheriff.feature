@sheriff-player-attribute

Feature: 🎖️ Sheriff player attribute

  Scenario: 🎖️ Sheriff must break ties between votes

    Given a created game with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | Thomas  | villager |
      | JB      | villager |
      | Babou   | villager |
    Then the game's current play should be survivors to elect-sheriff
    And the game's current play should be played by the following players
      | name    |
      | Antoine |
      | Olivia  |
      | Thomas  |
      | JB      |
      | Babou   |
    And the game's current play occurrence should be anytime

    When the survivors elect sheriff with the following votes
      | voter   | target |
      | Antoine | Olivia |
      | JB      | Olivia |
      | Thomas  | Olivia |
    Then the player named Olivia should have the active sheriff from survivors attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Babou
    Then the player named Babou should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | JB     | Thomas |
      | Thomas | JB     |
    Then the player named JB should be alive
    And the player named Thomas should be alive
    And the game's current play should be sheriff to settle-votes
    And the game's current play should be played by the following players
      | name   |
      | Olivia |

    When the sheriff breaks the tie in votes by choosing the player named Thomas
    Then the player named JB should be alive
    And the player named Thomas should be murdered by sheriff from vote

  Scenario: 🎖️ Sheriff has doubled vote

    Given a created game with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | Thomas  | villager |
      | JB      | villager |
      | Babou   | villager |
    Then the game's current play should be survivors to elect-sheriff

    When the survivors elect sheriff with the following votes
      | voter   | target |
      | Antoine | Olivia |
      | JB      | Olivia |
      | Thomas  | Olivia |
    Then the player named Olivia should have the active sheriff from survivors attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Babou
    Then the player named Babou should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | JB     | Olivia |
      | Olivia | JB     |
    Then the player named JB should be murdered by survivors from vote

  Scenario: 🎖️ Sheriff has normal vote with the right option

    Given a created game with options described in file sheriff-has-normal-vote-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | Thomas  | villager |
      | JB      | villager |
      | Babou   | villager |
    Then the game's current play should be survivors to elect-sheriff

    When the survivors elect sheriff with the following votes
      | voter   | target |
      | Antoine | Olivia |
      | JB      | Olivia |
      | Thomas  | Olivia |
    Then the player named Olivia should have the active sheriff from survivors attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Babou
    Then the player named Babou should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the survivors vote with the following votes
      | voter  | target |
      | JB     | Olivia |
      | Olivia | JB     |
    Then the player named JB should be alive
    And the game's current play should be sheriff to settle-votes

  Scenario: 🎖️ Sheriff is elected on the first tick of the game

    Given a created game with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | Thomas  | villager |
      | JB      | villager |
      | Babou   | villager |
    Then the game's current play should be survivors to elect-sheriff

  Scenario: 🎖️ Sheriff can be deactivated with the right option

    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | Thomas  | villager |
      | JB      | villager |
      | Babou   | villager |
    Then the game's current play should be werewolves to eat

  Scenario: 🎖️ Sheriff can be elected on first day instead of first night with right option

    Given a created game with options described in file sheriff-election-on-first-day-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | Thomas  | villager |
      | JB      | villager |
      | Babou   | villager |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Babou
    Then the player named Babou should be murdered by werewolves from eaten
    And the game's current play should be survivors to elect-sheriff

  Scenario: 🎖️ Sheriff can be elected on second night instead of first night with right option

    Given a created game with options described in file sheriff-election-on-second-night-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | Thomas  | villager |
      | JB      | villager |
      | Babou   | villager |
    Then the game's current play should be werewolves to eat

    When the werewolves eat the player named Babou
    Then the player named Babou should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote

    When the player or group skips his turn
    Then the game's current play should be survivors to elect-sheriff

  Scenario: 🎖️ Sheriff delegates if he is not the idiot

    Given a created game with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | Thomas  | villager |
      | JB      | villager |
      | Babou   | villager |
    Then the game's current play should be survivors to elect-sheriff

    When the survivors elect sheriff with the following votes
      | voter   | target |
      | Antoine | Thomas |
      | JB      | Thomas |
      | Thomas  | Olivia |
    Then the player named Thomas should have the active sheriff from survivors attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be sheriff to delegate
    And the game's current play should be played by the following players
      | name   |
      | Thomas |
    And the game's current play occurrence should be consequential

    When the sheriff delegates his role to the player named Olivia
    Then the player named Olivia should have the active sheriff from sheriff attribute

  Scenario: 🎖️ Sheriff doesn't delegate if he is the idiot

    Given a created game with the following players
      | name    | role     |
      | Antoine | villager |
      | Olivia  | werewolf |
      | Thomas  | idiot    |
      | JB      | villager |
      | Babou   | villager |
    Then the game's current play should be survivors to elect-sheriff

    When the survivors elect sheriff with the following votes
      | voter   | target |
      | Antoine | Thomas |
      | JB      | Thomas |
      | Thomas  | Olivia |
    Then the player named Thomas should have the active sheriff from survivors attribute
    And the game's current play should be werewolves to eat

    When the werewolves eat the player named Thomas
    Then the player named Thomas should be murdered by werewolves from eaten
    And the game's current play should be survivors to vote
    And the player named Thomas should have the active sheriff from survivors attribute

  Scenario: 🎖️ Sheriff election is randomized when there is a tie

    Given a created game with the following players
      | name    | role     |
      | Antoine | witch    |
      | JB      | werewolf |
      | Olivia  | hunter   |
      | Thomas  | seer     |

    When the survivors elect sheriff with the following votes
      | source  | target  |
      | Antoine | JB      |
      | Thomas  | JB      |
      | JB      | Antoine |
      | Olivia  | Antoine |
    Then the game's current play should be survivors to elect-sheriff because previous-votes-were-in-ties
    But nobody should have the active sheriff from survivors attribute

    When the survivors elect sheriff with the following votes
      | source  | target  |
      | Antoine | JB      |
      | Thomas  | Antoine |
    Then 1 of the following players should have the active sheriff from survivors attribute
      | name    |
      | Antoine |
      | JB      |