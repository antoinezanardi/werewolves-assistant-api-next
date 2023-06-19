function toJSON<T extends object>(obj: T | null): Record<keyof T, unknown> | null {
  return JSON.parse(JSON.stringify(obj)) as Record<keyof T, unknown>;
}

export { toJSON };