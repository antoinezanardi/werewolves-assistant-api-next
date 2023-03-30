enum GAME_PLAY_ACTIONS {
  EAT = "eat",
  LOOK = "look",
  CHARM = "charm",
  USE_POTIONS = "use-potions",
  SHOOT = "shoot",
  PROTECT = "protect",
  MARK = "mark",
  MEET_EACH_OTHER = "meet-each-other",
  SNIFF = "sniff",
  CHOOSE_MODEL = "choose-model",
  CHOOSE_SIDE = "choose-side",
  BAN_VOTING = "ban-voting",
  CHOOSE_SIGN = "choose-sign",
  CHOOSE_CARD = "choose-card",
  ELECT_SHERIFF = "elect-sheriff",
  VOTE = "vote",
  DELEGATE = "delegate",
  SETTLE_VOTES = "settle-votes",
}

enum GAME_PLAY_CAUSES {
  STUTTERING_JUDGE_REQUEST = "stuttering-judge-request",
}

enum WITCH_POTIONS {
  LIFE = "life",
  DEATH = "death",
}

export { GAME_PLAY_ACTIONS, GAME_PLAY_CAUSES, WITCH_POTIONS };