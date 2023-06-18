enum UNEXPECTED_EXCEPTION_REASONS {
  CANT_FIND_PLAYER_WITH_ID_IN_GAME = `Can't find player with id "{{playerId}}" in game "{{gameId}}"`,
  PLAYER_IS_DEAD = `Player with id "{{playerId}}" is dead in game "{{gameId}}"`,
  CANT_GENERATE_GAME_PLAYS = `Can't generate game plays`,
}

export { UNEXPECTED_EXCEPTION_REASONS };