const ENVIRONNEMENTS = ["development", "production", "test"] as const;

const MIN_PORT_VALUE = 0;

const MAX_PORT_VALUE = 65535;

const DEFAULT_APP_HOST = "127.0.0.1";

const DEFAULT_APP_PORT = 8080;

export {
  ENVIRONNEMENTS,
  MIN_PORT_VALUE,
  MAX_PORT_VALUE,
  DEFAULT_APP_HOST,
  DEFAULT_APP_PORT,
};