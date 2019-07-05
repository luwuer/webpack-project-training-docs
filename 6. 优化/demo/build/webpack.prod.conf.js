const {
  CleanWebpackPlugin
} = require('clean-webpack-plugin')
const TerserJSPlugin = require("terser-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const config = require('./config')
// const {
//   resolve
// } = require('./utils')

const webpackConfig = {
  mode: 'development',
  // mode: 'production',
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
    ],
    splitChunks: {
      chunks: 'all',
      minSize: 1, // 正常设置 20000+ 即 20k+ ，但这里我们的公共文件只有几行代码，所以设置为 1
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '/',
      name(mod, chunks) {
        if (chunks[0].name === 'app') return 'dependencies/app.vendor'

        return chunks[0].name

        // if (/src/.test(mod.request)) {
        //   let requestName = mod.request.replace(/.*\\src\\/, '').replace(/"/g, '')
        //   if (requestName) return requestName
        // } else if (/node_modules/.test(mod.request)) {
        //   return 'dependencies/' + mod.request.match(/node_modules.[\w-]+/)[0].replace(/node_modules./, '')
        // }
        // return 'unname'
        // return null
      },
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
    })
  ]
}

if (config.production.bundleAnalyzer) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
