
const path = require('path')

module.exports = {
  mode: 'development',
  entry: './hello-world.js',
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname, './')
  }
}
