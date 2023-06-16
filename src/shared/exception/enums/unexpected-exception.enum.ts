enum UNEXPECTED_EXCEPTION_REASONS {
  BAD_PLAY_TARGETS_COUNT = `Play must have "{{expected}}" target(s) but "{{actual}}" target(s) was/were provided`,
  CANT_FIND_PLAYER_WITH_ID_IN_GAME = `Can't find player with id "{{playerId}}" in game "{{gameId}}"`,
  PLAYER_IS_DEAD = `Player with id "{{playerId}}" is dead in game "{{gameId}}"`,
}

export { UNEXPECTED_EXCEPTION_REASONS };