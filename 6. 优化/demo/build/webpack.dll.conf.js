const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { resolve } = require('./utils')

const libs = {
  _frame: ['vue', 'vue-router', 'vuex']
}

module.exports = {
  mode: 'production',
  entry: { ...libs },
  performance: false,
  output: {
    path: resolve('dll'),
    filename: '[name].dll.js',
    library: '[name]' // 与 DllPlugin.name 保持一致
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name: '[name]',
      path: resolve('dll', '[name].manifest.json'),
      context: resolve('')
    })
  ]
}
