enum GamePlayActions {
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
  BURY_DEAD_BODIES = "bury-dead-bodies",
  GROWL = "growl",
  INFECT = "infect",
}

enum GamePlayCauses {
  STUTTERING_JUDGE_REQUEST = "stuttering-judge-request",
  PREVIOUS_VOTES_WERE_IN_TIES = "previous-votes-were-in-ties",
  ANGEL_PRESENCE = "angel-presence",
}

enum GamePlayOccurrences {
  ONE_NIGHT_ONLY = "one-night-only",
  ON_NIGHTS = "on-nights",
  ON_DAYS = "on-days",
  ANYTIME = "anytime",
  CONSEQUENTIAL = "consequential",
}

enum WitchPotions {
  LIFE = "life",
  DEATH = "death",
}

export {
  GamePlayActions,
  GamePlayCauses,
  GamePlayOccurrences,
  WitchPotions,
};