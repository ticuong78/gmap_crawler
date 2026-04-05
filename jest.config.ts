import type { Config } from "jest";

const tsJestTransform = {
  "^.+\\.tsx?$": [
    "ts-jest",
    {
      tsconfig: "<rootDir>/tsconfig.jest.json",
      useESM: true,
    },
  ],
};

const config: Config = {
  projects: [
    {
      displayName: "unit",
      testEnvironment: "node",
      transform: tsJestTransform,
      testMatch: ["<rootDir>/src/**/*.spec.ts"],
      testPathIgnorePatterns: ["<rootDir>/src/__tests__"],
    },
    {
      displayName: "integration",
      testEnvironment: "node",
      transform: tsJestTransform,
      setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup/jest.setup.ts"],
      testMatch: ["<rootDir>/src/__tests__/**/*.integration.spec.ts"],
      testPathIgnorePatterns: ["<rootDir>/src/__tests__/deprecated"],
    },
  ],
};

export default config;
