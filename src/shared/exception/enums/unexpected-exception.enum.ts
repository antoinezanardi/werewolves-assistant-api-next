enum UNEXPECTED_EXCEPTION_SCOPES {
  WEREWOLVES_EAT = "Werewolves eat",
  KILL_PLAYER = "Kill player",
}

enum UNEXPECTED_EXCEPTION_REASONS {
  MALFORMED_GAME_PLAY_PAYLOAD = "Expected game play payload is malformed or has invalid data",
  TOO_LESS_TARGETED_PLAYERS = "Too less targeted players for this game play",
  CANT_FIND_PLAYER_WITH_ID_IN_GAME = `Can't find player with id "{{playerId}}" in game "{{gameId}}"`,
  PLAYER_IS_DEAD = `Player with id "{{playerId}}" is dead`,
}

export { UNEXPECTED_EXCEPTION_SCOPES, UNEXPECTED_EXCEPTION_REASONS };