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
      setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup/jest.setup.ts"],
      testMatch: ["<rootDir>/src/__tests__/**/*.integration.spec.ts"],
    },
  ],
};

export default config;
