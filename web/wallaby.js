module.exports = function(wallaby) {
  return {
    files: [
      'src/**/*.js',
      '!src/**/?(*.)+(spec|test).js?(x)'
    ],
    tests: ['src/**/?(*.)+(spec|test).js?(x)'],
    env: {
      type: 'node',
      runner: 'node'
    },
    compilers: {
      '**/*.js?(x)': wallaby.compilers.babel()
    },
    testFramework: 'jest',
    debug: false
  };
};
