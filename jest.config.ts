export default {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/modules/**/useCases/**/*UseCase.ts'
  ],
  coverageDirectory: 'coverage',
  coverageProvider: "v8",
  coverageReporters: [
    "text-summary",
    "lcov",
  ],
  preset: 'ts-jest',
  setupFiles: ["dotenv/config"],
  testMatch: [
    '**/*.spec.ts'
  ]
};
