import { LogLevel } from "../../1_application/enums/LogLevel";
import { ILogger } from "../../1_application/ports/ILogger";

export abstract class AbstractLogger implements ILogger {
  log(msg: string, level: LogLevel): void {
    switch (level) {
      case LogLevel.Info:
        this.info(msg);
        break;
      case LogLevel.Warn:
        this.warn(msg);
        break;
      case LogLevel.Debug:
        this.debug(msg);
        break;
      case LogLevel.Error:
        this.error(msg);
        break;
    }
  }

  protected abstract info(msg: string): void;
  protected abstract warn(msg: string): void;
  protected abstract debug(msg: string): void;
  protected abstract error(msg: string): void;
}
