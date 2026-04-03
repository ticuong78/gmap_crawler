import { AbstractLogger } from "../concretes/AbstractLogger";

export class ConsoleLogger extends AbstractLogger {
  private format(level: string, msg: string): string {
    const time = new Date().toISOString();
    return `[${time}] [${level}] ${msg}`;
  }

  protected info(msg: string): void {
    console.info(this.format("INFO", msg));
  }

  protected warn(msg: string): void {
    console.warn(this.format("WARN", msg));
  }

  protected debug(msg: string): void {
    console.debug(this.format("DEBUG", msg));
  }

  protected error(msg: string): void {
    console.error(this.format("ERROR", msg));
  }
}
