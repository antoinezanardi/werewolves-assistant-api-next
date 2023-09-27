function toJSON(obj: null): null;
function toJSON<T extends object>(obj: T[]): Record<keyof T, unknown>[];
function toJSON<T extends object>(obj: T): Record<keyof T, unknown>;
function toJSON<T extends object>(obj: T | null): Record<keyof T, unknown> | null;

function toJSON<T extends object>(obj: T | T[] | null): Record<keyof T, unknown> | Record<keyof T, unknown>[] | null {
  if (Array.isArray(obj)) {
    return obj.map(item => JSON.parse(JSON.stringify(item)) as Record<keyof T, unknown>);
  }
  return JSON.parse(JSON.stringify(obj)) as Record<keyof T, unknown>;
}

export { toJSON };