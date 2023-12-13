enum UnexpectedExceptionReasons {
  CANT_FIND_PLAYER_WITH_ID_IN_GAME = `Can't find player with id "{{playerId}}" for game with id "{{gameId}}"`,
  PLAYER_IS_DEAD = `Player with id "{{playerId}}" is dead in game with id "{{gameId}}"`,
  CANT_GENERATE_GAME_PLAYS = `Can't generate game plays`,
  NO_CURRENT_GAME_PLAY = `Game with id "{{gameId}}" doesn't have a current game play to deal with`,
  NO_GAME_PLAY_PRIORITY = `Game play "{{gamePlay}}" doesn't have a set priority`,
  MALFORMED_CURRENT_GAME_PLAY = `Current game play with action "{{action}}" and source "{{source}}" are not consistent for game with id "{{gameId}}"`,
  CANT_FIND_LAST_NOMINATED_PLAYERS = `Can't find last nominated players for game with id "{{gameId}}"`,
  CANT_FIND_LAST_DEAD_PLAYERS = `Can't find last dead players for game with id "{{gameId}}"`,
}

export { UnexpectedExceptionReasons };