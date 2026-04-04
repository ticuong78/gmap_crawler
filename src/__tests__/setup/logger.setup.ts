import { ConsoleLogger } from "../../2_infrastructure/loggers/ConsoleLogger";

export function createLogger() {
  return new ConsoleLogger();
}
