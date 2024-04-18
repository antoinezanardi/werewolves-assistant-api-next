import { ApiSortOrder } from "@/shared/api/enums/api.enums";

function getMongooseSortValueFromApiSortOrder(sortOrder: ApiSortOrder): number {
  return sortOrder === ApiSortOrder.ASC ? 1 : -1;
}

export { getMongooseSortValueFromApiSortOrder };