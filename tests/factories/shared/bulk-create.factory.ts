function bulkCreate<T>(length: number, entityFactory: () => T): T[] {
  return Array.from(Array(length)).map(entityFactory);
}

export { bulkCreate };