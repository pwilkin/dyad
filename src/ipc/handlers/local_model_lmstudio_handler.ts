import { ipcMain } from "electron";
import log from "electron-log";
import type { LocalModelListResponse, LocalModel } from "../ipc_types";

const logger = log.scope("lmstudio_handler");

export interface LMStudioModel {
  type: "llm" | "embedding" | string;
  id: string;
  object: string;
  publisher: string;
  state: "loaded" | "not-loaded";
  max_context_length: number;
  quantization: string
  compatibility_type: string
  arch: string;
  [key: string]: any;
}

export async function fetchLMStudioModels(): Promise<LocalModelListResponse> {
  try {
    const modelsResponse: Response = await fetch("http://localhost:1234/api/v0/models");
    if (!modelsResponse.ok) {
      throw new Error("Failed to fetch models from LM Studio");
    }
    const modelsJson = await modelsResponse.json();
    const downloadedModels = modelsJson.data as LMStudioModel[];
    const models: LocalModel[] = downloadedModels
      .filter((model: any) => model.type === "llm")
      .map((model: any) => ({
        modelName: model.id,
        displayName: model.id,
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