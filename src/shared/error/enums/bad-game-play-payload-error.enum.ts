enum BAD_GAME_PLAY_PAYLOAD_REASONS {
  NO_UPCOMING_GAME_PLAY = "Game doesn't have upcoming plays",
  UNEXPECTED_STUTTERING_JUDGE_VOTE_REQUEST = "`doesJudgeRequestAnotherVote` can't be set on this current game's state",
  UNEXPECTED_CHOSEN_SIDE = "`chosenSide` can't be set on this current game's state",
  UNEXPECTED_VOTES = "`votes` can't be set on this current game's state",
  REQUIRED_VOTES = "`votes` is required on this current game's state",
  SAME_SOURCE_AND_TARGET_VOTE = "One vote has the same source and target",
  UNEXPECTED_INFECTED_TARGET = "`targets.isInfected` can't be set on this current game's state",
  TOO_MUCH_INFECTED_TARGETS = "There are too much infected targets (`targets.isInfected`)",
  UNEXPECTED_DRANK_POTION_TARGET = "`targets.drankPotion` can't be set on this current game's state",
  TOO_MUCH_DRANK_LIFE_POTION_TARGETS = "There are too much targets which drank life potion (`targets.drankPotion`)",
  TOO_MUCH_DRANK_DEATH_POTION_TARGETS = "There are too much targets which drank death potion (`targets.drankPotion`)",
  BAD_LIFE_POTION_TARGET = "Life potion can't be applied to this target (`targets.drankPotion`)",
  BAD_DEATH_POTION_TARGET = "Death potion can't be applied to this target (`targets.drankPotion`)",
  UNEXPECTED_TARGETS = "`targets` can't be set on this current game's state",
  UNEXPECTED_CHOSEN_CARD = "`chosenCard` can't be set on this current game's state",
  REQUIRED_CHOSEN_CARD = "`chosenCard` is required on this current game's state",
  REQUIRED_TARGETS = "`targets` is required on this current game's state",
}

export { BAD_GAME_PLAY_PAYLOAD_REASONS };