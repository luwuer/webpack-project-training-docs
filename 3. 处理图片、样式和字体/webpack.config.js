const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: './src.js',
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname, './dist')
  },
  plugins:[
    new HtmlWebpackPlugin()
  ]
}
