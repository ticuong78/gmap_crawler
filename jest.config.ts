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
      moduleNameMapper: {
        "^@src/(.*)$": "<rootDir>/src/$1",
        "^@tests/(.*)$": "<rootDir>/tests/$1",
      },
      testMatch: ["<rootDir>/tests/unit/**/*.spec.ts"],
      testPathIgnorePatterns: ["<rootDir>/tests/archive"],
    },
    {
      displayName: "integration",
      testEnvironment: "node",
      transform: tsJestTransform,
      moduleNameMapper: {
        "^@src/(.*)$": "<rootDir>/src/$1",
        "^@tests/(.*)$": "<rootDir>/tests/$1",
      },
      setupFilesAfterEnv: ["<rootDir>/tests/integration/setup/jest.setup.ts"],
      testMatch: ["<rootDir>/tests/integration/specs/**/*.integration.spec.ts"],
      testPathIgnorePatterns: ["<rootDir>/tests/archive"],
    },
  ],
};

export default config;
