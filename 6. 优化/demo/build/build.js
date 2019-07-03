const webpack = require('webpack')
const chalk = require('chalk')
const Spinner = require('cli-spinner').Spinner
const {
  generateWebpackConfig,
  webpackStatsPrint
} = require('./utils')

const production = process.argv[2] === 'production'
const config = generateWebpackConfig(production)

if (production) {
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
} else {
  module.exports = config
}
