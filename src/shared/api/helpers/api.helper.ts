import { API_RESOURCES } from "../enums/api.enum";

function getResourceSingularForm(resource: API_RESOURCES): string {
  const resourceSingularForms: Record<API_RESOURCES, string> = {
    [API_RESOURCES.GAMES]: "game",
    [API_RESOURCES.PLAYERS]: "player",
    [API_RESOURCES.GAME_ADDITIONAL_CARDS]: "additional card",
    [API_RESOURCES.ROLES]: "role",
    [API_RESOURCES.HEALTH]: "health",
  };
  return resourceSingularForms[resource];
}

export { getResourceSingularForm };