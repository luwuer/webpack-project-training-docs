const path = require('path')

module.exports = {
  mode: 'development',
  entry: './src.js',
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname, './')
  }
}
