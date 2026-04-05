import { app, BrowserWindow } from "electron";

type ElectronOptionValue = string | number | boolean;

type SingleOption = {
  key: string;
  value?: ElectronOptionValue;
};

function toSwitchName(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .replace(/_/g, "-")
    .toLowerCase();
}

function loadElectronOptions(): SingleOption[] {
  const rawOptions = process.env.TEST_ELECTRON_OPTIONS_JSON;

  if (!rawOptions) return [];

  try {
    const parsed = JSON.parse(rawOptions);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

for (const option of loadElectronOptions()) {
  const switchName = toSwitchName(option.key);

  if (option.value === false) {
    app.commandLine.appendArgument(`--no-${switchName}`);
    continue;
  }

  if (option.value === true || option.value === undefined) {
    app.commandLine.appendSwitch(switchName);
    continue;
  }

  app.commandLine.appendSwitch(switchName, String(option.value));
}

app.whenReady().then(() => {
  const win = new BrowserWindow({
    show: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  win.webContents.setAudioMuted(true);
  win.loadURL("about:blank");

  // Đợi window load xong rồi mới signal ready
  win.webContents.once("did-finish-load", () => {
    console.log("ELECTRON_READY");
  });
});
