function toJSON(obj: null): null;
function toJSON<T extends object>(obj: T[]): Record<keyof T, unknown>[];
function toJSON<T extends object>(obj: T): Record<keyof T, unknown>;
function toJSON<T extends object>(obj: T | null): Record<keyof T, unknown> | null;

function toJSON<T extends object>(obj: T | T[] | null): Record<keyof T, unknown> | Record<keyof T, unknown>[] | null {
  return JSON.parse(JSON.stringify(obj)) as Record<keyof T, unknown> | Record<keyof T, unknown>[] | null;
}

export { toJSON };