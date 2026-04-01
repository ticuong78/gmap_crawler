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
      preset: "jest-puppeteer",
      testMatch: ["<rootDir>/src/__tests__/**/*.integration.spec.ts"],
      transform: {
        "^.+\\.ts$": [
          "ts-jest",
          {
            tsconfig: "<rootDir>/tsconfig.json",
          },
        ],
      },
    },
  ],
};

export default config;
