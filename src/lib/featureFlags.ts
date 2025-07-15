/**
 * Feature flags for controlling application features
 */

export interface FeatureFlags {
  askAI: boolean;
}

/**
 * Get feature flags based on environment
 */
export function getFeatureFlags(): FeatureFlags {
  // Ask AI is disabled by default - only enabled when explicitly set to 'true'
  const askAIEnabled = import.meta.env.PUBLIC_ENABLE_ASK_AI === "true";

  return {
    askAI: askAIEnabled, // Defaults to false if env var not set or not 'true'
  };
}

/**
 * Check if a specific feature is enabled
 */
export function isFeatureEnabled(feature: keyof FeatureFlags): boolean {
  const flags = getFeatureFlags();
  return flags[feature];
}
