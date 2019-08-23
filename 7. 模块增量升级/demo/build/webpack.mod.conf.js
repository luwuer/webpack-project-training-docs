const webpack = require('webpack')
const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const TerserJSPlugin = require("terser-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const config = require('./config')
const {
  resolve
} = require('./utils')

const generateModConfig = mod => {
  const webpackConfig = {
    mode: 'production',
    devtool: config.production.sourceMap ?
      'cheap-module-source-map' : 'none',
    entry: resolve(`src/modules/${mod}/index.js`),
    output: {
      path: resolve(`modules/${mod}`),
      publicPath: `/modules/${mod}/`,
      filename: `${mod}.js`,
      chunkFilename: '[name].[contentHash:5].chunk.js',
      library: `_${mod}`,
      libraryTarget: 'umd'
    },
    resolve: {
      alias: {
        '@': resolve('src'),
        '@mod-a': resolve('src/modules/mod-a'),
        '@mod-b': resolve('src/modules/mod-b')
      }
    },
    optimization: {
      minimizer: [
        new TerserJSPlugin({
          parallel: true // 开启多线程压缩
        }),
        new OptimizeCSSAssetsPlugin({})
      ],
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 0,
        minChunks: 1,
        maxAsyncRequests: 5,
        maxInitialRequests: 3,
        automaticNameDelimiter: '/',
        name: true,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true
          }
        }
      }
    },
    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:5].css',
        chunkFilename: 'css/[name].[contenthash:5].css'
      }),
      new webpack.BannerPlugin({
        banner: `@auther 莫得盐\n@version ${
          require('../package.json').version
          }\n@info hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]`
      })
    ]
  }

  if (config.production.bundleAnalyzer) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
      .BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
  }

  return webpackConfig
}

module.exports = generateModConfig
