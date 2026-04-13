module.exports = function withNativewind(config) {
  config.experiments = config.experiments || {};
  config.experiments.tsconfigPaths = true;
  return config;
};
