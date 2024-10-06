@game-feedback
Feature: 💯 Game Feedback

  Scenario: 💯 Feedback is attached to game when user posts feedback
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Juju    | villager |
      | Doudou  | werewolf |
      | JB      | villager |
    Then the game's feedback should be null

    When a feedback with score of 4, with bug and review "Mok" is posted
    Then the request should have succeeded with status code 201
    And the game's feedback score should be 4
    And the game's feedback should mention an encountered error
    And the game's feedback review should be "Mok"

    When the werewolves eat the player named Antoine
    Then the game's feedback score should be 4
    And the game's feedback should mention an encountered error
    And the game's feedback review should be "Mok"

  Scenario: 💯 Feedback can't be created twice for the same game
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Juju    | villager |
      | Doudou  | werewolf |
      | JB      | villager |

    When a feedback with score of 4, with bug and review "Mok" is posted
    Then the request should have succeeded with status code 201

    When a feedback with score of 3, without bug and review "Wow" is posted
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Game already has feedback"

  Scenario: 💯 Feedback can't be created with a score lower than 1
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Juju    | villager |
      | Doudou  | werewolf |
      | JB      | villager |

    When a feedback with score of 0, without bug and review "Wow" is posted
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                       |
      | score must not be less than 1 |

  Scenario: 💯 Feedback can't be created with a score higher than 5
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Juju    | villager |
      | Doudou  | werewolf |
      | JB      | villager |

    When a feedback with score of 6, without bug and review "Wow" is posted
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                          |
      | score must not be greater than 5 |

  Scenario: 💯 Feedback can't be created with a review longer than 1000 characters
    Given a created game with options described in file no-sheriff-option.json and with the following players
      | name    | role     |
      | Antoine | villager |
      | Juju    | villager |
      | Doudou  | werewolf |
      | JB      | villager |

    When a feedback with score of 4, without bug and review "This function is responsible for handling user authentication within the application. It takes a username and password as input, then validates the credentials against the stored user data. If the credentials match, it generates an authentication token for the user session. In case of an incorrect password or non-existent user, an error message is returned. Proper security measures such as encryption should be applied to ensure safe handling of sensitive information. I'm a very long comment, you must be shorter please, This function is responsible for handling user authentication within the application. It takes a username and password as input, then validates the credentials against the stored user data. If the credentials match, it generates an authentication token for the user session. In case of an incorrect password or non-existent user, an error message is returned. Proper security measures such as encryption should be applied to ensure safe handling of sensitive information. I'm a very long comment, you must be shorter please" is posted
    Then the request should have failed with status code 400
    And the request exception status code should be 400
    And the request exception error should be "Bad Request"
    And the request exception messages should be
      | message                                                 |
      | review must be shorter than or equal to 1000 characters |
