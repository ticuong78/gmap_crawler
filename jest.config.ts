import type { Config } from "jest";

const config: Config = {
  projects: [
    {
      displayName: "unit",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["<rootDir>/src/**/*.spec.ts"],
      testPathIgnorePatterns: ["<rootDir>/src/__tests__"],
    },
    {
      displayName: "integration",
      preset: "ts-jest",
      testEnvironment: "node",
      testMatch: ["<rootDir>/src/__tests__/**/*.integration.spec.ts"],
      testEnvironmentOptions: {
        electronOptions: ["--no-sandbox", "--disable-gpu", "--headless"],
      },
    },
  ],
};

export default config;
