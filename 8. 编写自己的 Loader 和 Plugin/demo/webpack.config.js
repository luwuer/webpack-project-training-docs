
const path = require('path')
const HelloPlugin = require('./helloPlugin/copyright.js')

module.exports = {
  mode: 'development',
  entry: './hello-world.js',
  output: {
    filename: 'dist.js',
    path: path.resolve(__dirname, './')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{
          loader: path.resolve(__dirname, './helloLoader/index.js')
        }]
      }
    ]
  },
  plugins: [
    new HelloPlugin({
      // banner: '123'
    })
  ]
}
