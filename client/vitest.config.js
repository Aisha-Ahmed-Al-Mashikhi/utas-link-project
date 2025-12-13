// Import Vitest configuration helper
import { defineConfig } from "vitest/config";

// Export Vitest configuration
export default defineConfig({
  // Test configuration
  test: {
    // Enable global test APIs
    globals: "true",
    // Use browser-like DOM environment
    environment: "jsdom",
  },
});
