// jest.config.mjs
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  setupFiles: ['whatwg-fetch'],

  // Transform configuration
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          '@babel/preset-react',
        ],
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(@testing-library/react)/)'],

  // Module configuration
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json', 'node'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },

  // Extension configuration
  extensionsToTreatAsEsm: ['.jsx', '.ts', '.tsx'],

  // Test patterns
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],

  // Coverage configuration
  collectCoverageFrom: [
    'src/components/ProductCard.jsx',
    'src/components/CustomButton.jsx',
    'src/components/context/CartContext.jsx',
    'src/components/hooks/useProductAvailability.js',
    'src/components/hooks/useProductPrice.js',
    'src/components/hooks/useProductStockRecords.js',
    'src/components/ui/button.tsx',
    'src/components/ui/card.tsx',
    'src/lib/utils.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/dist/',
    '/.next/',
    '/public/',
  ],
}
