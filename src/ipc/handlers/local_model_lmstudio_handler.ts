import { ipcMain } from "electron";
import log from "electron-log";
import { LocalModelListResponse, LocalModel } from "../ipc_types";
import { LMStudioClient } from "@lmstudio/sdk";

const logger = log.scope("lmstudio_handler");

export interface LMStudioModel {
  type: "llm" | "embedding" | string;
  modelKey: string;
  path: string;
  displayName: string;
  provider: "lmstudio";
  format?: string;
  sizeBytes?: number;
  paramsString?: string;
  architecture?: string;
  maxContextLength?: number;
  [key: string]: any;
}

export async function fetchLMStudioModels(): Promise<LocalModelListResponse> {
  try {
    const client = new LMStudioClient();
    const downloadedModels = await client.system.listDownloadedModels();
    const models: LocalModel[] = downloadedModels
      .filter((model: any) => model.type === "llm")
      .map((model: any) => ({
        modelName: model.modelKey || model.path,
        displayName: model.displayName || model.path.split(/[/\\]/).pop(),
        provider: "lmstudio"
      }));

    logger.info(`Successfully fetched ${models.length} models from LM Studio`);
    return { models, error: null };
  } catch (error) {
    return { models: [], error: "Failed to fetch models from LM Studio" };
  }
}

export function registerLMStudioHandlers() {
  ipcMain.handle('local-models:list-lmstudio', async (): Promise<LocalModelListResponse> => {
    return fetchLMStudioModels();
  });
}