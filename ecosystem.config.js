module.exports = {
  apps : [
    {
      name      : 'test-test-server',
      script    : 'src/server/server.js',
      watch     : true,
      env: {
        NODE_ENV: 'development'
      },
      env_production : {
        NODE_ENV: 'production'
      }
    },
  ]
};

