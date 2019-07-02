const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const TerserJSPlugin = require("terser-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const config = require('./config')
// const {
//   resolve
// } = require('./utils')

const webpackConfig = {
  mode: 'production',
  devtool: config.production.sourceMap ?
    'cheap-module-eval-source-map' : 'none',
  output: {
    filename: '[name].[contentHash:5].js',
    chunkFilename: '[name].[contentHash:5].chunk.js'
  },
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        parallel: true // 开启多线程压缩
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
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
