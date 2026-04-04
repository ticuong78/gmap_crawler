export type ElectronOptionValue = string | number | boolean;

export type SingleOption = {
  key: string;
  value?: ElectronOptionValue;
};

function normalizeOptionKey(key: string): string {
  return key.replace(/[-_]/g, "").toLowerCase();
}

export class ElectronOptions {
  constructor(private _options: SingleOption[]) {}

  add(option: SingleOption): void {
    this._options = this._options.concat(option);
  }

  remove(key: string): void {
    const normalizedKey = normalizeOptionKey(key);

    this._options = this._options.filter(
      (option) => normalizeOptionKey(option.key) !== normalizedKey,
    );
  }

  get(key: string): ElectronOptionValue | undefined {
    const normalizedKey = normalizeOptionKey(key);

    for (const option of this._options) {
      if (normalizeOptionKey(option.key) === normalizedKey) {
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

  toJSON(): SingleOption[] {
    return this._options.map((option) => ({ ...option }));
  }
}
