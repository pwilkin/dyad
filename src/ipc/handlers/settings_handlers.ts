import { ipcMain } from "electron";
import type { UserSettings } from "../../lib/schemas";
import { writeSettings } from "../../main/settings";
import { readSettings } from "../../main/settings";

export function registerSettingsHandlers() {
  ipcMain.handle("get-user-settings", async () => {
    const settings = readSettings();

    // Mask API keys before sending to renderer
    if (settings?.providerSettings) {
      // Use optional chaining
      for (const providerKey in settings.providerSettings) {
        // Ensure the key is own property and providerSetting exists
        if (
          Object.prototype.hasOwnProperty.call(
            settings.providerSettings,
            providerKey
          )
        ) {
          const providerSetting = settings.providerSettings[providerKey];
          // Check if apiKey exists and is a non-empty string before masking
          if (providerSetting?.apiKey?.value) {
            providerSetting.apiKey.value = providerSetting.apiKey.value.substring(0, 2) + "*".repeat(providerSetting.apiKey.value.length - 2);
          }
        }
      }
    }

    return settings;
  });

  ipcMain.handle(
    "set-user-settings",
    async (_, settings: Partial<UserSettings>) => {
      writeSettings(settings);
      return readSettings();
    }
  );
}
