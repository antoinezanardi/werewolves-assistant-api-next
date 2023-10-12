type MongoosePropOptions = {
  required?: boolean;
  type?: unknown;
  default?: unknown;
  enum?: unknown[];
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  validate?: [(value: unknown) => Promise<boolean> | boolean, string];
};

export type { MongoosePropOptions };