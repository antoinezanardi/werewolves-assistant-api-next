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
  SCANDALMONGER_MARKED = "scandalmonger-marked",
  IN_LOVE = "in-love",
  WORSHIPED = "worshiped",
  POWERLESS = "powerless",
  CANT_VOTE = "cant-vote",
  CHARMED = "charmed",
  GROWLED = "growled",
  CONTAMINATED = "contaminated",
  STOLEN_ROLE = "stolen-role",
  ACTING = "acting",
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

enum PlayerInteractionTypes {
  EAT = "eat",
  LOOK = "look",
  CHARM = "charm",
  GIVE_LIFE_POTION = "give-life-potion",
  GIVE_DEATH_POTION = "give-death-potion",
  SHOOT = "shoot",
  PROTECT = "protect",
  MARK = "mark",
  VOTE = "vote",
  CHOOSE_AS_MODEL = "choose-as-model",
  CHOOSE_AS_SHERIFF = "choose-as-sheriff",
  SNIFF = "sniff",
  BAN_VOTING = "ban-voting",
  TRANSFER_SHERIFF_ROLE = "transfer-sheriff-role",
  SENTENCE_TO_DEATH = "sentence-to-death",
  STEAL_ROLE = "steal-role",
}

export {
  PlayerGroups,
  PlayerAttributeNames,
  PlayerDeathCauses,
  PlayerInteractionTypes,
};