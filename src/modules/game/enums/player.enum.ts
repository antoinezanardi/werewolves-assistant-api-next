enum PlayerGroups {
  SURVIVORS = "survivors",
  VILLAGERS = "villagers",
  WEREWOLVES = "werewolves",
  LOVERS = "lovers",
  CHARMED = "charmed",
}

enum PlayerAttributeNames {
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

enum PlayerDeathCauses {
  DEATH_POTION = "death-potion",
  EATEN = "eaten",
  SHOT = "shot",
  VOTE = "vote",
  VOTE_SCAPEGOATED = "vote-scapegoated",
  RECONSIDER_PARDON = "reconsider-pardon",
  BROKEN_HEART = "broken-heart",
  DISEASE = "disease",
}

export {
  PlayerGroups,
  PlayerAttributeNames,
  PlayerDeathCauses,
};