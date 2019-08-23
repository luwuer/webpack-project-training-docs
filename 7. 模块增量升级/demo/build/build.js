const webpack = require('webpack')
const chalk = require('chalk')
const Spinner = require('cli-spinner').Spinner
const {
  generateWebpackConfig,
  webpackStatsPrint
} = require('./utils')

// 环境传参
const env = process.argv[2]
// 生产环境
const production = env === 'production'
// 模块环境
const mod = env === 'mod'

if (production) {
  let config = generateWebpackConfig('production')

  let spinner = new Spinner('building: ')
  spinner.start()

  webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
      webpackStatsPrint(stats)

      console.log(chalk.red('× Build failed with errors.\n'))
      process.exit()
    }

    webpackStatsPrint(stats)

    spinner.stop()

    console.log('\n')
    console.log(chalk.cyan('√ Build complete.\n'))
    console.log(
      chalk.yellow(
        '  Built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      )
    )
  })
} else if (mod) {
  const mods = process.argv.splice(3)
  mods.forEach(modName => {
    let config = generateWebpackConfig('mod', modName)

    let spinner = new Spinner(`${modName} building: `)
    spinner.start()

    webpack(config, (err, stats) => {
      if (err || stats.hasErrors()) {
        webpackStatsPrint(stats)

        console.log(chalk.red(`× ${modName} build failed with errors.\n`))
        process.exit()
      }

      webpackStatsPrint(stats)

      spinner.stop()

      console.log('\n')
      console.log(chalk.cyan(`√ ${modName} build complete.\n`))
      console.log(
        chalk.yellow(
          '  Module should be loaded by base project.\n'
        )
      )
    })
  })
} else {
  module.exports = generateWebpackConfig('development')
}
