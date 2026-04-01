import { LogLevel } from "../../enums/LogLevel";

export interface ILogger {
  log(msg: string, level: LogLevel): void;
}
