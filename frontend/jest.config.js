export default {
  preset: '',
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react|react-native|@react-native-community|@expo)',
  ],
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
  },
}
