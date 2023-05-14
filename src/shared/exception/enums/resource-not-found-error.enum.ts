enum RESOURCE_NOT_FOUND_REASONS {
  UNKNOWN_GAME_PLAY_GAME_ID = "Game Play - Game Id is unknown in database",
  UNMATCHED_GAME_PLAY_REVEALED_PLAYER = "Game Play - Player in `revealedPlayers` is not in the game players",
  UNMATCHED_GAME_PLAY_DEAD_PLAYER = "Game Play - Player in `deadPlayers` is not in the game players",
  UNMATCHED_GAME_PLAY_PLAYER_SOURCE = "Game Play - Player in `source.players` is not in the game players",
  UNMATCHED_GAME_PLAY_PLAYER_TARGET = "Game Play - Player in `targets.player` is not in the game players",
  UNMATCHED_GAME_PLAY_PLAYER_VOTE_SOURCE = "Game Play - Player in `votes.source` is not in the game players",
  UNMATCHED_GAME_PLAY_PLAYER_VOTE_TARGET = "Game Play - Player in `votes.target` is not in the game players",
  UNMATCHED_GAME_PLAY_CHOSEN_CARD = "Game Play - Chosen card is not in the game additional cards",
}

export { RESOURCE_NOT_FOUND_REASONS };