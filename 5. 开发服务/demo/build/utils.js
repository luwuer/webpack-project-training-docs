const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')

const _memorize = fn => {
  const cache = {}
  return (...args) => {
    const _args = JSON.stringify(args)
    return cache[_args] || (cache[_args] = fn.call(this, ...args))
  }
}

const _resolve = (...args) => {
  return path.join(__dirname, '..', ...args)
}

const resolve = _memorize(_resolve)

const generateWebpackConfig = production => {
  if (production) {
    process.env.NODE_ENV = 'production'
    return merge(require('./webpack.base.conf'), require('./webpack.prod.conf'))
  } else {
    process.env.NODE_ENV = 'development'
    return merge(require('./webpack.base.conf'), require('./webpack.dev.conf'))
  }
}

const webpackStatsPrint = function (stats) {
  console.log(
    stats
    .toString({
      colors: true,
      modules: false,
      // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      children: false,
      chunks: false,
      chunkModules: false
    })
    .replace(/\n.*?static.*?(?=\n)/g, '') + '\n'
  )
}

module.exports = {
  resolve,
  generateWebpackConfig,
  webpackStatsPrint
}
