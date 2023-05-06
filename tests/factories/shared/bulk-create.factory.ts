function bulkCreate<T>(length: number, entityFactory: (entity: Partial<T>, override: object) => T, entities: Partial<T>[] = [], overrides: object[] = []): T[] {
  return Array.from(Array(length)).map((item, index) => {
    const entity = index < entities.length ? entities[index] : {};
    const override = index < overrides.length ? overrides[index] : {};
    return entityFactory(entity, override);
  });
}

export { bulkCreate };