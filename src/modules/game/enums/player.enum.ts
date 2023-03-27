enum PLAYER_GROUPS {
  ALL = "all",
  VILLAGERS = "villagers",
  WEREWOLVES = "werewolves",
  LOVERS = "lovers",
  CHARMED = "charmed",
}

enum PLAYER_ATTRIBUTE_NAMES {
  SHERIFF = "sheriff",
  SEEN = "seen",
  EATEN = "eaten",
  DRANK_LIFE_POTION = "drank-life-potion",
  DRANK_DEATH_POTION = "drank-death-potion",
  PROTECTED = "protected",
  RAVEN_MARKED = "raven-marked",
  IN_LOVE = "in-love",
  WORSHIPED = "worshiped",
  POWERLESS = "powerless",
  CANT_VOTE = "cant-vote",
  CHARMED = "charmed",
  GROWLED = "growled",
  CONTAMINATED = "contaminated",
}

enum PLAYER_DEATH_CAUSES {
  DEATH_POTION = "death-potion",
  EATEN = "eaten",
  SHOT = "shot",
  VOTE = "vote",
  RECONSIDER_PARDON = "reconsider-pardon",
  BROKEN_HEART = "broken-heart",
  DISEASE = "disease",
}

export { PLAYER_GROUPS, PLAYER_ATTRIBUTE_NAMES, PLAYER_DEATH_CAUSES };