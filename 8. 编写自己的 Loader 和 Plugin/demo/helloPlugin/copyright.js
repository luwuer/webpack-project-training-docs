const { ConcatSource } = require('webpack-sources')

module.exports = class copyrightWebpackPlugin {
  constructor(options) {
    // 一般还应做参数合法性校验
    let defualt = ` * @copyright ${require('../package.json').auther}\n * @version ${require('../package.json').version}`
    this.banner = options.banner || defualt
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('copyrightWebpackPlugin', compilation => {
      compilation.hooks.optimizeChunkAssets.tapAsync('copyrightWebpackPlugin', (chunks, callback) => {
        chunks.forEach(chunk => {
          chunk.files.forEach(file => {
            console.log(this.banner)
            compilation.assets[file] = new ConcatSource(
              `/*\n${this.banner}\n */`,
              '\n\n',
              compilation.assets[file]
            )
          })
        })

        callback()
      })
    })
  }
}
