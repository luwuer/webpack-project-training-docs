const webpack = require('webpack')

module.exports = {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    open: true,
    compress: true,
    port: 9002,
    hot: true,
    hotOnly: false, // HMR 构建失败时刷新页面
    historyApiFallback: true, // 任意的 404 响应都被替代为 index.html
    clientLogLevel: 'none',
    stats: 'minimal',
    inline: true,
    proxy: {
      '/api': {
        target: 'http://10.20.23.209:8089/',
        pathRewrite: {
          '/api': ''
        }
      }
    }
  },
  optimization: {
    usedExports: true,
    runtimeChunk: {
      name: 'runtime'
    }
  },
  plugins: [new webpack.HotModuleReplacementPlugin()]
}
