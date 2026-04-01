import { LogLevel } from "../../1_application/enums/LogLevel";
import { ILogger } from "../../1_application/ports/Logger/ILogger";
import { AbstractLogger } from "../concretes/AbstractLogger";

export class ConsoleLogger extends AbstractLogger implements ILogger {
  log(msg: string, level: LogLevel): void {
    throw new Error("Method not implemented.");
  }

  protected info(msg: string): void {
    throw new Error("Method not implemented.");
  }

  protected warn(msg: string): void {
    throw new Error("Method not implemented.");
  }

  protected debug(msg: string): void {
    throw new Error("Method not implemented.");
  }

  protected error(msg: string): void {
    throw new Error("Method not implemented.");
  }
}
