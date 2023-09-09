import { ApiResources } from "@/shared/api/enums/api.enum";

function getResourceSingularForm(resource: ApiResources): string {
  const resourceSingularForms: Record<ApiResources, string> = {
    [ApiResources.GAMES]: "game",
    [ApiResources.PLAYERS]: "player",
    [ApiResources.GAME_ADDITIONAL_CARDS]: "additional card",
    [ApiResources.ROLES]: "role",
    [ApiResources.HEALTH]: "health",
  };
  return resourceSingularForms[resource];
}

export { getResourceSingularForm };