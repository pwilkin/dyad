import { ipcMain, } from "electron";
import { platform, arch } from "node:os";
import type { SystemDebugInfo } from "../ipc_types";
import { readSettings } from "../../main/settings";
import log from "electron-log";
import path from "node:path";
import fs from "node:fs";
import { runShellCommand } from "../utils/runShellCommand";

export function registerDebugHandlers() {
  ipcMain.handle(
    "get-system-debug-info",
    async (): Promise<SystemDebugInfo> => {
      console.log("IPC: get-system-debug-info called");

      // Get Node.js and pnpm versions
      let nodeVersion: string | null = null;
      let pnpmVersion: string | null = null;
      let nodePath: string | null = null;
      try {
        nodeVersion = await runShellCommand("node --version");
      } catch (err) {
        console.error("Failed to get Node.js version:", err);
      }

      try {
        pnpmVersion = await runShellCommand("pnpm --version");
      } catch (err) {
        console.error("Failed to get pnpm version:", err);
      }

      try {
        if (platform() === "win32") {
          nodePath = await runShellCommand("where.exe node");
        } else {
          nodePath = await runShellCommand("which node");
        }
      } catch (err) {
        console.error("Failed to get node path:", err);
      }

      // Get Dyad version from package.json
      const packageJsonPath = path.resolve(
        __dirname,
        "..",
        "..",
        "package.json"
      );
      let dyadVersion = "unknown";
      try {
        const packageJson = JSON.parse(
          fs.readFileSync(packageJsonPath, "utf8")
        );
        dyadVersion = packageJson.version;
      } catch (err) {
        console.error("Failed to read package.json:", err);
      }

      // Get telemetry info from settings
      const settings = readSettings();
      const telemetryId = settings.telemetryUserId || "unknown";

      // Get logs from electron-log
      let logs = "";
      try {
        const logPath = log.transports.file.getFile().path;
        if (fs.existsSync(logPath)) {
          const logContent = fs.readFileSync(logPath, "utf8");
          const logLines = logContent.split("\n");
          logs = logLines.slice(-100).join("\n");
        }
      } catch (err) {
        console.error("Failed to read log file:", err);
        logs = `Error reading logs: ${err}`;
      }

      return {
        nodeVersion,
        pnpmVersion,
        nodePath,
        telemetryId,
        telemetryConsent: settings.telemetryConsent || "unknown",
        telemetryUrl: "https://us.i.posthog.com", // Hardcoded from renderer.tsx
        dyadVersion,
        platform: process.platform,
        architecture: arch(),
        logs,
      };
    }
  );

  console.log("Registered debug IPC handlers");
}
