import { ConsoleLogger } from "../../../src/2_infrastructure/loggers/ConsoleLogger";

export function createLogger() {
  return new ConsoleLogger();
}
