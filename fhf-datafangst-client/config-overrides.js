const path = require("path");
const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
  });
  config.resolve.fallback = fallback;

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);

  const eslint_plugin = new ESLintPlugin({
    extensions: ["ts", "tsx"],
    configType: "flat",
    overrideConfigFile: path.resolve(__dirname, "eslint.config.mjs"),
  });

  const idx = config.plugins.findIndex((v) => v.key === "ESLintWebpackPlugin");
  if (idx >= 0) {
    config.plugins[idx] = eslint_plugin;
  } else {
    config.plugins.push(eslint_plugin);
  }

  config.ignoreWarnings = [/Failed to parse source map/];

  config.module.rules.push({
    test: /\.(js|mjs|jsx)$/,
    enforce: "pre",
    loader: require.resolve("source-map-loader"),
    resolve: {
      fullySpecified: false,
    },
  });

  return config;
};
