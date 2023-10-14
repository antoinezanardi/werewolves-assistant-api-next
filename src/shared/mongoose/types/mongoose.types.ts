type MongoosePropOptions = {
  required?: boolean;
  type?: unknown;
  default?: unknown;
  enum?: unknown[] | readonly unknown[];
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
  validate?: readonly [(value: unknown) => Promise<boolean> | boolean, string] | [(value: unknown) => Promise<boolean> | boolean, string];
};

export type { MongoosePropOptions };