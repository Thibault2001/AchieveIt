module.exports = {
    // ... autres options de configuration Jest
    transform: {
      '^.+\\.jsx?$': 'babel-jest',
    },
    testEnvironment: 'jsdom', // Configure Jest to use jsdom
  };
  