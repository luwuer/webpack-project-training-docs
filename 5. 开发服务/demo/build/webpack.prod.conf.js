const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const config = require('./config')
const {
  resolve
} = require('./utils')

const webpackConfig = {
  mode: 'production',
  devtool: config.production.sourceMap ?
    'cheap-module-eval-source-map' : 'none',
  output: {
    filename: '[name].[contentHash:5].js',
    chunkFilename: '[name].[contentHash:5].chunk.js'
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}

if (config.production.bundleAnalyzer) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
