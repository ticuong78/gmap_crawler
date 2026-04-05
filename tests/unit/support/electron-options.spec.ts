import { ElectronOptions } from "@tests/support/electron-options";

describe("ElectronOptions", () => {
  describe("get()", () => {
    it("normalizes key formats when resolving option values", () => {
      const options = new ElectronOptions([
        { key: "remote-debugging-port", value: 9333 },
        { key: "Lang", value: "vi-VN" },
      ]);

      expect(options.get("remoteDebuggingPort")).toBe(9333);
      expect(options.get("remote_debugging_port")).toBe(9333);
      expect(options.get("lang")).toBe("vi-VN");
    });
  });

  describe("add()", () => {
    it("appends new options to the serialized args", () => {
      const options = new ElectronOptions([{ key: "NoSandbox" }]);

      options.add({ key: "RemoteDebuggingPort", value: 9229 });

      expect(options.toArgs()).toStrictEqual([
        "--no-sandbox",
        "--remote-debugging-port=9229",
      ]);
    });
  });

  describe("remove()", () => {
    it("removes options using normalized keys", () => {
      const options = new ElectronOptions([
        { key: "RemoteDebuggingPort", value: 9222 },
        { key: "Disable_GPU" },
      ]);

      options.remove("remote-debugging-port");

      expect(options.get("remoteDebuggingPort")).toBeUndefined();
      expect(options.toArgs()).toStrictEqual(["--disable-gpu"]);
    });
  });

  describe("getRemoteDebuggingPort()", () => {
    it("returns the stored port for number and string values", () => {
      const numberOption = new ElectronOptions([
        { key: "RemoteDebuggingPort", value: 9444 },
      ]);
      const stringOption = new ElectronOptions([
        { key: "RemoteDebuggingPort", value: "9555" },
      ]);

      expect(numberOption.getRemoteDebuggingPort()).toBe(9444);
      expect(stringOption.getRemoteDebuggingPort()).toBe(9555);
    });

    it("falls back to the provided default when the option is missing", () => {
      const options = new ElectronOptions([]);

      expect(options.getRemoteDebuggingPort(9777)).toBe(9777);
    });
  });

  describe("toArgs()", () => {
    it("serializes booleans, undefined, strings, and numbers into CLI args", () => {
      const options = new ElectronOptions([
        { key: "DisableGPU", value: true },
        { key: "EnableLogging", value: false },
        { key: "Lang", value: "vi-VN" },
        { key: "RemoteDebuggingPort", value: 9222 },
        { key: "NoSandbox" },
      ]);

      expect(options.toArgs()).toStrictEqual([
        "--disable-gpu",
        "--no-enable-logging",
        "--lang=vi-VN",
        "--remote-debugging-port=9222",
        "--no-sandbox",
      ]);
    });
  });

  describe("toJSON()", () => {
    it("returns a cloned copy of the stored options", () => {
      const options = new ElectronOptions([
        { key: "RemoteDebuggingPort", value: 9222 },
      ]);

      const json = options.toJSON();
      json[0].value = 9555;

      expect(options.get("remoteDebuggingPort")).toBe(9222);
      expect(json).toStrictEqual([{ key: "RemoteDebuggingPort", value: 9555 }]);
    });
  });
});

