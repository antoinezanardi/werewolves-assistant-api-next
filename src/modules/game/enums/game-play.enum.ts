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
}

enum GamePlayCauses {
  STUTTERING_JUDGE_REQUEST = "stuttering-judge-request",
  PREVIOUS_VOTES_WERE_IN_TIES = "previous-votes-were-in-ties",
  ANGEL_PRESENCE = "angel-presence",
}

enum WitchPotions {
  LIFE = "life",
  DEATH = "death",
}

export {
  GamePlayActions,
  GamePlayCauses,
  WitchPotions,
};