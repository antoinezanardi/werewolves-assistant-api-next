import { registerDecorator } from "class-validator";
import type { ValidationOptions } from "class-validator";

import { RoleNames } from "@/modules/role/enums/role.enum";
import { ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLE_NAMES, ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLES } from "@/modules/role/constants/role.constant";
import type { CreateGameAdditionalCardDto } from "@/modules/game/dto/create-game/create-game-additional-card/create-game-additional-card.dto";

function areAdditionalCardsForActorRolesRespected(value: unknown): boolean {
  if (value === undefined) {
    return true;
  }
  const additionalCards = value as CreateGameAdditionalCardDto[];
  const actorAdditionalCards = additionalCards.filter(({ recipient }) => recipient === RoleNames.ACTOR);
  const eligibleActorAdditionalCardsRoleNames = ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLES.map(({ name }) => name);
  return actorAdditionalCards.every(({ roleName }) => eligibleActorAdditionalCardsRoleNames.includes(roleName));
}

function getAdditionalCardsForActorRolesDefaultMessage(): string {
  return `additionalCards.roleName for actor must be one of the following values: ${ELIGIBLE_ACTOR_ADDITIONAL_CARDS_ROLE_NAMES.toString()}`;
}

function AdditionalCardsForActorRoles(validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: "AdditionalCardsForActorRoles",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate: areAdditionalCardsForActorRolesRespected,
        defaultMessage: getAdditionalCardsForActorRolesDefaultMessage,
      },
    });
  };
}

export {
  AdditionalCardsForActorRoles,
  getAdditionalCardsForActorRolesDefaultMessage,
  areAdditionalCardsForActorRolesRespected,
};