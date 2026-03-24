import { LogLevel } from "../entities/LogLevel";

export abstract class AbstractLogger {
  public log(msg: string, level: LogLevel) {}

  private info(mssg: string) {}
  private warn(mssg: string) {}
  private debug(mssg: string) {}
  private error(mssg: string) {}
}
