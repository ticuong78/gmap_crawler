export type ElectronOptionValue = string | number | boolean;

export type SingleOption = {
  key: string;
  value?: ElectronOptionValue;
};

export class ElectronOptions {
  constructor(private _options: SingleOption[]) {}

  add(option: SingleOption): void {
    this._options = this._options.concat(option);
  }

  remove(key: string): void {
    this._options = this._options.filter((option) => option.key !== key);
  }

  get(key: string): ElectronOptionValue | undefined {
    for (const option of this._options) {
      if (option.key === key) {
        return option.value;
      }
    }

    return undefined;
  }

  getRemoteDebuggingPort(defaultPort: number = 9222): number {
    const value = this.get("remoteDebuggingPort");

    if (typeof value === "number") return value;
    if (typeof value === "string" && value.trim() !== "") return Number(value);

    return defaultPort;
  }

  toArgs(): string[] {
    return this._options.map((option) => {
      const kebabKey = option.key
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
        .replace(/_/g, "-")
        .toLowerCase();

      if (option.value === false) {
        return `--no-${kebabKey}`;
      }

      if (option.value === true || option.value === undefined) {
        return `--${kebabKey}`;
      }

      return `--${kebabKey}=${option.value}`;
    });
  }
}
