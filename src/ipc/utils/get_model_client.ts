import { createAnthropic } from "@ai-sdk/anthropic";
import { createGoogleGenerativeAI as createGoogle } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { createOllama } from "ollama-ai-provider";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { AUTO_MODELS, PROVIDER_TO_ENV_VAR } from "../../constants/models";
import type { LargeLanguageModel, UserSettings } from "../../lib/schemas";
import { getEnvVar } from "./read_env";
export function getModelClient(
  model: LargeLanguageModel,
  settings: UserSettings
) {
  // Handle 'auto' provider by trying each model in AUTO_MODELS until one works
  if (model.provider === "auto") {
    // Try each model in AUTO_MODELS in order until finding one with an API key
    for (const autoModel of AUTO_MODELS) {
      const apiKey =
        settings.providerSettings?.[autoModel.provider]?.apiKey ||
        getEnvVar(PROVIDER_TO_ENV_VAR[autoModel.provider]);

      if (apiKey) {
        console.log(
          `Using provider: ${autoModel.provider} model: ${autoModel.name}`
        );
        // Use the first model that has an API key
        return getModelClient(
          {
            provider: autoModel.provider,
            name: autoModel.name,
          } as LargeLanguageModel,
          settings
        );
      }
    }

    // If no models have API keys, throw an error
    throw new Error("No API keys available for any model in AUTO_MODELS");
  }

  const apiKey =
    settings.providerSettings?.[model.provider]?.apiKey?.value ||
    getEnvVar(PROVIDER_TO_ENV_VAR[model.provider]);
  switch (model.provider) {
    case "openai": {
      const provider = createOpenAI({ apiKey });
      return provider(model.name);
    }
    case "anthropic": {
      const provider = createAnthropic({ apiKey });
      return provider(model.name);
    }
    case "google": {
      const provider = createGoogle({ apiKey });
      return provider(model.name);
    }
    case "openrouter": {
      const provider = createOpenRouter({ apiKey });
      return provider(model.name);
    }
    case "ollama": {
      const provider = createOllama();
      return provider(model.name);
   }
   case "lmstudio": {
     // Using LM Studio's OpenAI compatible API
     const baseURL = "http://localhost:1234/v1"; // Default LM Studio OpenAI API URL
     const provider = createOpenAICompatible({ name: "lmstudio", baseURL });
     return provider(model.name);
   }
   default: {
      // Ensure exhaustive check if more providers are added
      const _exhaustiveCheck: never = model.provider;
      throw new Error(`Unsupported model provider: ${model.provider}`);
    }
  }
}
