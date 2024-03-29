import type { Config } from "@jest/types";

const baseDir = "<rootDir>/src/app";
const baseTestDir = "<rootDir>/src/test/";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "node",
  verbose: true,
  collectCoverage: false,
  collectCoverageFrom: [`${baseDir}/**/*.ts`],
  testMatch: [`${baseTestDir}/**/*.test.ts`]
  ,testPathIgnorePatterns: [`${baseTestDir}/IntegrationTests/`],
  setupFiles:[
      '<rootDir>/src/test/IntegrationTests/Utils/config.ts'
  ]
};

export default config;
