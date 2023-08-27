
import type { ApiPropertyOptions } from "@nestjs/swagger";

import { defaultGameOptions } from "@/modules/game/constants/game-options/game-options.constant";
import type { RolesGameOptions } from "@/modules/game/schemas/game-options/roles-game-options/roles-game-options.schema";

const rolesGameOptionsFieldsSpecs = Object.freeze({
  areRevealedOnDeath: { default: defaultGameOptions.roles.areRevealedOnDeath },
  doSkipCallIfNoTarget: { default: defaultGameOptions.roles.doSkipCallIfNoTarget },
});

const rolesGameOptionsApiProperties: Record<keyof RolesGameOptions, ApiPropertyOptions> = Object.freeze({
  areRevealedOnDeath: {
    description: "If set to `true`, player's role is revealed when he's dead",
    ...rolesGameOptionsFieldsSpecs.areRevealedOnDeath,
  },
  doSkipCallIfNoTarget: {
    description: "If set to `true`, player's role won't be called if there is no target available for him",
    ...rolesGameOptionsFieldsSpecs.doSkipCallIfNoTarget,
  },
  sheriff: { description: "Game `sheriff` role's options." },
  bigBadWolf: { description: "Game `big bad wolf` role's options." },
  whiteWerewolf: { description: "Game `white werewolf` role's options." },
  seer: { description: "Game `seer` role's options." },
  littleGirl: { description: "Game `little girl` role's options." },
  guard: { description: "Game `guard` role's options." },
  ancient: { description: "Game `ancient` role's options." },
  idiot: { description: "Game `idiot` role's options." },
  twoSisters: { description: "Game `two sisters` role's options." },
  threeBrothers: { description: "Game `three brothers` role's options." },
  fox: { description: "Game `fox` role's options." },
  bearTamer: { description: "Game `bear tamer` role's options." },
  stutteringJudge: { description: "Game `stuttering judge` role's options." },
  wildChild: { description: "Game `wild child` role's options." },
  dogWolf: { description: "Game `dog wolf` role's options." },
  thief: { description: "Game `thief` role's options." },
  piedPiper: { description: "Game `pied piper` role's options." },
  raven: { description: "Game `raven` role's options." },
});

export { rolesGameOptionsApiProperties, rolesGameOptionsFieldsSpecs };