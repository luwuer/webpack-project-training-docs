module.exports = class HelloPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap('HelloPlugin', compilation => {
      console.log('helloPlugin load successful')
    })
  }
}
